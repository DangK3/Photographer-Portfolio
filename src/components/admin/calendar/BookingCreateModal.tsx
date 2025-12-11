'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, User, Check, Plus, Trash2, Loader2, Calendar as CalendarIcon, ChevronDown, Search } from 'lucide-react';
import { toast } from 'sonner';
import { 
  format, addMinutes, startOfDay, startOfMonth, endOfMonth, 
  eachDayOfInterval, getDay, isSameDay, addMonths, subMonths 
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { createBooking } from '@/lib/actions/bookings';
import { createCustomer } from '@/lib/actions/customers';
import { RoomWithBranch, ServiceItem } from '@/lib/actions/studio';
import { CustomerRow } from '@/lib/actions/customers';
import ModalPortal from '@/components/ui/ModalPortal';

// --- HELPER: Tạo danh sách khung giờ 15 phút ---
const generateTimeOptions = () => {
  const times = [];
  const start = startOfDay(new Date());
  for (let i = 0; i < 24 * 4; i++) {
    const t = addMinutes(start, i * 15);
    times.push(format(t, 'HH:mm'));
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

// --- SUB-COMPONENT: DATE SELECTOR (MINI CALENDAR) ---
interface DateSelectorProps {
  value: Date;
  onChange: (date: Date) => void;
  align?: 'left' | 'right';
}

const DateSelector = ({ value, onChange, align = 'left' }: DateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // State viewDate để user lướt xem tháng khác mà không đổi ngày đã chọn
  const [viewDate, setViewDate] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync viewDate khi mở lại hoặc value đổi
  useEffect(() => {
    if (isOpen) setViewDate(value);
  }, [isOpen, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Logic tạo lịch
  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(viewDate),
      end: endOfMonth(viewDate),
    });
  }, [viewDate]);

  const startDay = getDay(startOfMonth(viewDate));
  // Điều chỉnh để Thứ 2 là đầu tuần (0: CN, 1: T2,... 6: T7) -> Muốn T2 index 0
  // getDay: 0(CN), 1(T2)... 
  // Map: T2(1)->0, T3(2)->1, ... CN(0)->6
  const paddingDaysCount = startDay === 0 ? 6 : startDay - 1;
  const paddingDays = Array(paddingDaysCount).fill(null);

  return (
    <div ref={containerRef} className="relative inline-block ml-2">
      <span 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className={`text-xs font-medium cursor-pointer transition-all border-b border-transparent
          ${isOpen 
            ? 'text-[var(--admin-primary)] border-[var(--admin-primary)]' 
            : 'text-[var(--admin-sub)] hover:text-[var(--admin-fg)] hover:border-[var(--admin-sub)]'
          }
        `}
      >
        {format(value, 'dd/MM', { locale: vi })}
      </span>

      {isOpen && (
        <div onClick={(e) => e.stopPropagation()}
            className={`
                absolute top-full mt-2 p-3 bg-[var(--admin-card)] border border-[var(--admin-border)] 
                rounded-xl shadow-xl z-[60] w-64 animate-in fade-in zoom-in-95 duration-100
                ${align === 'right' ? 'right-0' : 'left-0'} /* Căn phải nếu align=right */
            `}>
           {/* Header: Tháng & Nav */}
           <div className="flex items-center justify-between mb-3">
              <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="hover:bg-[var(--admin-hover)] p-1 rounded text-[var(--admin-sub)] text-xs">‹</button>
              <div className="text-[11px] font-bold text-[var(--admin-fg)] uppercase tracking-wider">
                  Tháng {format(viewDate, 'MM/yyyy')}
              </div>
              <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="hover:bg-[var(--admin-hover)] p-1 rounded text-[var(--admin-sub)] text-xs">›</button>
          </div>
          
          {/* Thứ trong tuần */}
          <div className="grid grid-cols-7 text-center text-[9px] gap-y-2 text-[var(--admin-sub)] font-medium mb-1">
              <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span className="text-red-400">CN</span>
          </div>

          {/* Lưới ngày */}
          <div className="grid grid-cols-7 text-center text-[10px] gap-1">
              {paddingDays.map((_, i) => <span key={`pad-${i}`} />)}
              {daysInMonth.map(d => {
                  const isSelected = isSameDay(d, value);
                  const isToday = isSameDay(d, new Date());
                  return (
                      <span 
                          key={d.toString()} 
                          onClick={() => { onChange(d); setIsOpen(false); }}
                          className={`
                              cursor-pointer h-7 w-7 flex items-center justify-center rounded-full transition-all
                              ${isSelected 
                                  ? 'bg-[var(--admin-primary)] text-white font-bold shadow-md' 
                                  : isToday 
                                      ? 'text-[var(--admin-primary)] font-bold border border-[var(--admin-primary)]'
                                      : 'text-[var(--admin-fg)] hover:bg-[var(--admin-hover)]'
                              }
                          `}
                      >
                          {format(d, 'd')}
                      </span>
                  )
              })}
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: TIME SELECTOR (Modified to include DateSelector) ---
interface TimeSelectorProps {
  label: string;
  timeValue: string;
  dateValue: Date;
  onTimeChange: (val: string) => void;
  onDateChange: (val: Date) => void;
  className?: string;
  align?: 'left' | 'right';
}

const TimeSelector = ({ 
    label, timeValue, dateValue, onTimeChange, onDateChange, className, 
    align = 'left' // Mặc định left
}: TimeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      <span className="text-[10px] font-bold text-[var(--admin-sub)] uppercase mb-1 block tracking-wider">
        {label}
      </span>
      <div 
        className="flex items-baseline gap-1 select-none"
      >
        {/* TIME TRIGGER */}
        <div 
            ref={containerRef}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 cursor-pointer group"
        >
            <span className={`text-2xl font-bold text-[var(--admin-fg)] border-b-2 border-transparent transition-all
            ${isOpen ? 'border-[var(--admin-primary)] text-[var(--admin-primary)]' : 'group-hover:border-[var(--admin-sub)]'}
            `}>
            {timeValue}
            </span>
            <ChevronDown size={14} className={`text-[var(--admin-sub)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* DATE TRIGGER (Tách riêng để không bị lẫn sự kiện click) */}
        <DateSelector value={dateValue} onChange={onDateChange} align={align} />
      </div>

      {/* DROPDOWN CHỌN GIỜ */}
      {isOpen && (
        <div ref={containerRef} className={`absolute top-full mt-2 w-32 max-h-60 overflow-y-auto bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl shadow-xl z-50 table-scrollbar animate-in fade-in zoom-in-95 duration-100
          ${align === 'right' ? 'right-0' : 'left-0'}
        `}>
          {TIME_OPTIONS.map((t) => (
            <div
              key={t}
              onClick={() => { onTimeChange(t); setIsOpen(false); }}
              className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between
                ${t === timeValue ? 'bg-[var(--admin-primary)] text-white font-bold' : 'text-[var(--admin-fg)] hover:bg-[var(--admin-hover)]'}
              `}
            >
              {t}
              {t === timeValue && <Check size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

interface BookingCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    start: Date;
    end: Date;
    roomId: number;
  };
  rooms: RoomWithBranch[];
  services: ServiceItem[];
  customers: CustomerRow[];
  currentUserId: number;
}

export default function BookingCreateModal({
  isOpen,
  onClose,
  initialData,
  rooms,
  services,
  customers: initialCustomers,
  currentUserId
}: BookingCreateModalProps) {
  
  // --- STATES ---
  const [customers, setCustomers] = useState<CustomerRow[]>(initialCustomers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Thời gian (Giờ:Phút)
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');
  
  // Ngày đặt (Tách riêng để quản lý chọn ngày)
  const [bookingDate, setBookingDate] = useState<Date>(new Date());
  
  const [selectedRoomId, setSelectedRoomId] = useState(initialData.roomId);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [deposit, setDeposit] = useState<number>(0);
  const [selectedServices, setSelectedServices] = useState<{ id: number; quantity: number }[]>([]);

  // CUSTOMER SEARCH STATES
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [customerSearch, setCustomerSearch] = useState(''); 
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false); 
  const customerInputRef = useRef<HTMLDivElement>(null);

  // New Customer Form States
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [isCreatingCustLoading, setIsCreatingCustLoading] = useState(false);

  // --- 1. Tách các giá trị nguyên thủy (Primitives) để so sánh ổn định ---
  // .getTime() trả về số (number), React so sánh số theo giá trị chứ không theo địa chỉ bộ nhớ
  const initStartMillis = initialData.start.getTime();
  const initEndMillis = initialData.end.getTime();
  const initRoomId = initialData.roomId;

  // Sync Data khi mở Modal
  useEffect(() => {
    if (isOpen) {
      // --- 2. Dùng các biến nguyên thủy để set state ---
      // Tạo lại Date từ timestamp để đảm bảo an toàn
      const startDate = new Date(initStartMillis);
      const endDate = new Date(initEndMillis);

      setStartTimeStr(format(startDate, 'HH:mm'));
      setEndTimeStr(format(endDate, 'HH:mm'));
      setBookingDate(startDate); 
      
      setSelectedRoomId(initRoomId);
      
      // Reset form
      setSelectedCustomerId('');
      setNote('');
      setDeposit(0);
      setSelectedServices([]);
      
      // Reset Customer Search
      setIsCreatingCustomer(false);
      setCustomerSearch('');
      setIsCustomerDropdownOpen(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
    }
  }, [
      // --- 3. Dependency Array chỉ chứa Primitive Values ---
      // ESLint sẽ hài lòng vì ta dùng chính xác các biến này bên trong
      isOpen, 
      initStartMillis, 
      initEndMillis, 
      initRoomId
  ]);

  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (customerInputRef.current && !customerInputRef.current.contains(e.target as Node)) {
        setIsCustomerDropdownOpen(false);
      }
    };
    if (isCustomerDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCustomerDropdownOpen]);

  // --- LOGIC SEARCH KHÁCH HÀNG ---
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const lowerTerm = customerSearch.toLowerCase();
    return customers.filter(c => 
      c.full_name.toLowerCase().includes(lowerTerm) || 
      (c.phone && c.phone.includes(lowerTerm))
    );
  }, [customers, customerSearch]);

  const handleSelectCustomer = (customer: CustomerRow) => {
    setSelectedCustomerId(customer.customer_id);
    setCustomerSearch(customer.full_name); 
    setIsCustomerDropdownOpen(false);
  };

  // --- LOGIC TÍNH TOÁN ---
  const durationHours = useMemo(() => {
    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = endTimeStr.split(':').map(Number);
    if (isNaN(startH) || isNaN(endH)) return 0;
    
    let duration = (endH + endM / 60) - (startH + startM / 60);
    if (duration < 0) duration += 24;
    return Math.max(0, duration);
  }, [startTimeStr, endTimeStr]);

  const roomPricePerHour = 500000;
  const roomTotal = durationHours * roomPricePerHour;

  const servicesTotal = selectedServices.reduce((acc, item) => {
    const service = services.find(s => s.service_id === item.id);
    return acc + (service ? service.price * item.quantity : 0);
  }, 0);

  const grandTotal = roomTotal + servicesTotal;

  // --- HANDLERS ---

  const handleCreateCustomer = async () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      toast.error('Vui lòng nhập tên và số điện thoại');
      return;
    }
    setIsCreatingCustLoading(true);
    
    const formData = new FormData();
    formData.append('full_name', newCustomerName);
    formData.append('phone', newCustomerPhone);
    formData.append('customer_type', 'regular');

    const res = await createCustomer(formData);
    
    setIsCreatingCustLoading(false);

    if (res.success && res.data) {
      toast.success('Đã thêm khách hàng mới!');
      const newCust = res.data as CustomerRow;
      setCustomers([newCust, ...customers]);
      
      setSelectedCustomerId(newCust.customer_id);
      setCustomerSearch(newCust.full_name);
      
      setIsCreatingCustomer(false); 
    } else {
      toast.error(res.error || 'Lỗi tạo khách hàng');
    }
  };

  const handleAddService = (serviceId: string) => {
    const id = Number(serviceId);
    if (!id) return;
    
    const existing = selectedServices.find(s => s.id === id);
    if (existing) {
      setSelectedServices(prev => prev.map(s => s.id === id ? { ...s, quantity: s.quantity + 1 } : s));
    } else {
      setSelectedServices(prev => [...prev, { id, quantity: 1 }]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCustomerId) {
      toast.error('Chưa chọn khách hàng');
      return;
    }

    // TỔNG HỢP NGÀY VÀ GIỜ
    const baseDate = format(bookingDate, 'yyyy-MM-dd'); // Sử dụng ngày đã chọn
    const startISO = `${baseDate}T${startTimeStr}:00`;
    const endISO = `${baseDate}T${endTimeStr}:00`;

    if (new Date(startISO) >= new Date(endISO)) {
        toast.error('Giờ kết thúc phải sau giờ bắt đầu');
        return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerId: Number(selectedCustomerId),
        staffId: currentUserId,
        deposit: deposit,
        discount: 0,
        notes: note,
        items: [{
          roomId: selectedRoomId,
          startDt: new Date(startISO).toISOString(),
          endDt: new Date(endISO).toISOString(),
          price: roomTotal
        }],
        services: selectedServices.map(s => {
          const sv = services.find(x => x.service_id === s.id)!;
          return {
            serviceId: s.id,
            quantity: s.quantity,
            price: sv.price,
            type: sv.type
          };
        })
      };

      const result = await createBooking(payload);

      if (result.success) {
        toast.success('Đặt lịch thành công!');
        onClose();
        window.location.reload(); 
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      const msg = (error as Error).message || 'Lỗi kết nối hệ thống';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose} title="Tạo Lịch Mới" className="max-w-3xl">
      <div className="flex flex-col md:flex-row h-[80vh] md:h-auto">
        
        {/* --- LEFT COLUMN: INPUT FORM --- */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto table-scrollbar">
          
          {/* 1. KHU VỰC CHỌN GIỜ & NGÀY */}
          <div className="bg-[var(--admin-bg)] p-5 rounded-2xl border border-[var(--admin-border)] flex items-center justify-between gap-4">
             {/* Chọn Bắt đầu (Bao gồm cả Giờ và Ngày) */}
             <TimeSelector 
                label="Bắt đầu" 
                timeValue={startTimeStr} 
                dateValue={bookingDate} 
                onTimeChange={setStartTimeStr}
                onDateChange={setBookingDate} // Cập nhật ngày chung
             />
             
             <div className="h-8 w-[1px] bg-[var(--admin-border)]"></div>
             
             {/* Chọn Kết thúc (Dùng chung ngày với bắt đầu cho đơn giản hóa UI) */}
             <TimeSelector 
                label="Kết thúc" 
                timeValue={endTimeStr} 
                dateValue={bookingDate} 
                onTimeChange={setEndTimeStr}
                onDateChange={setBookingDate}
                className="text-right flex flex-col items-end"
                align="right"
             />
          </div>

          {/* ... PHẦN CÒN LẠI GIỮ NGUYÊN ... */}
          
          {/* 2. CHỌN PHÒNG */}
          <div>
             <label className="text-xs font-bold text-[var(--admin-sub)] uppercase mb-2 block">Phòng Studio</label>
             <div className="relative">
                <select
                    className="w-full p-3 pl-10 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl appearance-none outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] transition-all cursor-pointer text-[var(--admin-fg)] font-medium"
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                >
                    {rooms.filter(r => r.status === 'available'
                      && !(r.is_equipment_room === true)
                    ).map(r => (
                        <option key={r.room_id} value={r.room_id}>{r.name || r.code}</option>
                    ))}
                </select>
                <div className="absolute left-3 top-3.5 text-[var(--admin-sub)]">
                    <CalendarIcon size={18} />
                </div>
                <div className="absolute right-3 top-3.5 pointer-events-none text-[var(--admin-sub)]">
                    <ChevronDown size={16} />
                </div>
             </div>
          </div>

          {/* 3. KHÁCH HÀNG */}
          <div className="space-y-2" ref={customerInputRef}>
             <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[var(--admin-sub)] uppercase">Khách Hàng</label>
                {!isCreatingCustomer && (
                    <button 
                        onClick={() => setIsCreatingCustomer(true)}
                        className="text-[10px] bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] px-2 py-1 rounded-md font-bold hover:bg-[var(--admin-primary)] hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Plus size={12} /> TẠO MỚI
                    </button>
                )}
             </div>

             {isCreatingCustomer ? (
                // FORM TẠO KHÁCH INLINE
                <div className="bg-[var(--admin-bg)] p-4 rounded-xl border border-[var(--admin-border)] space-y-3 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[var(--admin-fg)]">Thông tin khách mới</span>
                        <button onClick={() => setIsCreatingCustomer(false)} className="text-[var(--admin-sub)] hover:text-[var(--admin-fg)]"><X size={16}/></button>
                    </div>
                    <input 
                        className="w-full p-2.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] text-sm focus:border-[var(--admin-primary)] outline-none"
                        placeholder="Họ và tên *"
                        value={newCustomerName}
                        onChange={e => setNewCustomerName(e.target.value)}
                    />
                    <input 
                        className="w-full p-2.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] text-sm focus:border-[var(--admin-primary)] outline-none"
                        placeholder="Số điện thoại *"
                        value={newCustomerPhone}
                        onChange={e => setNewCustomerPhone(e.target.value)}
                    />
                    <button 
                        onClick={handleCreateCustomer}
                        disabled={isCreatingCustLoading}
                        className="w-full py-2 bg-[var(--admin-fg)] text-[var(--admin-bg)] rounded-lg text-sm font-bold hover:opacity-90 flex justify-center items-center gap-2"
                    >
                        {isCreatingCustLoading ? <Loader2 className="animate-spin" size={14}/> : <Check size={14}/>} Lưu khách hàng
                    </button>
                </div>
             ) : (
                // SEARCHABLE INPUT
                <div className="relative">
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-3.5 text-[var(--admin-sub)]" />
                        <input
                            type="text"
                            placeholder="Tìm tên hoặc SĐT khách..."
                            className="w-full p-3 pl-10 pr-10 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] transition-all text-[var(--admin-fg)]"
                            value={customerSearch}
                            onChange={(e) => {
                                setCustomerSearch(e.target.value);
                                setIsCustomerDropdownOpen(true);
                                if (e.target.value === '') setSelectedCustomerId('');
                            }}
                            onFocus={() => setIsCustomerDropdownOpen(true)}
                        />
                        {customerSearch && (
                            <button 
                                onClick={() => { setCustomerSearch(''); setSelectedCustomerId(''); }}
                                className="absolute right-3 top-3.5 text-[var(--admin-sub)] hover:text-[var(--admin-fg)]"
                            >
                                <X size={16} />
                            </button>
                        )}
                        {!customerSearch && <Search size={16} className="absolute right-3 top-3.5 text-[var(--admin-sub)]" />}
                    </div>

                    {/* DROPDOWN RESULTS */}
                    {isCustomerDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl shadow-lg z-50 table-scrollbar animate-in fade-in zoom-in-95 duration-100">
                            {filteredCustomers.length === 0 ? (
                                <div className="p-3 text-center text-sm text-[var(--admin-sub)] italic">
                                    Không tìm thấy khách hàng.
                                </div>
                            ) : (
                                filteredCustomers.map(c => (
                                    <div
                                        key={c.customer_id}
                                        onClick={() => handleSelectCustomer(c)}
                                        className="px-4 py-3 hover:bg-[var(--admin-hover)] cursor-pointer border-b border-[var(--admin-border)] last:border-0"
                                    >
                                        <div className="text-sm font-bold text-[var(--admin-fg)]">{c.full_name}</div>
                                        <div className="text-xs text-[var(--admin-sub)]">{c.phone || 'Không có SĐT'}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
             )}
          </div>

          {/* 4. DỊCH VỤ THÊM */}
          <div>
             <label className="text-xs font-bold text-[var(--admin-sub)] uppercase mb-2 block">Dịch vụ đi kèm</label>
             <div className="relative">
                <select
                    className="w-full p-3 pl-10 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl appearance-none outline-none focus:border-[var(--admin-primary)] transition-all cursor-pointer text-[var(--admin-fg)] text-sm"
                    onChange={(e) => {
                        handleAddService(e.target.value);
                        e.target.value = ''; 
                    }}
                >
                    <option value="">+ Thêm dịch vụ...</option>
                    {services.map(s => (
                        <option key={s.service_id} value={s.service_id}>
                            {s.name} (+{new Intl.NumberFormat('vi-VN').format(s.price)}đ)
                        </option>
                    ))}
                </select>
                <Plus size={18} className="absolute left-3 top-3.5 text-[var(--admin-sub)]" />
             </div>

             {/* List dịch vụ đã chọn */}
             {selectedServices.length > 0 && (
                 <div className="mt-3 space-y-2">
                    {selectedServices.map(item => {
                        const sInfo = services.find(s => s.service_id === item.id);
                        return (
                            <div key={item.id} className="flex justify-between items-center bg-[var(--admin-bg)] p-2 rounded-lg border border-[var(--admin-border)] animate-fade-in-row">
                                <span className="text-sm font-medium text-[var(--admin-fg)]">{sInfo?.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-[var(--admin-sub)]">x{item.quantity}</span>
                                    <button 
                                        onClick={() => setSelectedServices(prev => prev.filter(x => x.id !== item.id))}
                                        className="text-[var(--admin-sub)] hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                 </div>
             )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Tiền cọc */}
             <div>
                <label className="text-xs font-bold text-[var(--admin-sub)] uppercase mb-2 block">
                  Tiền cọc (x1.000 đ)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0"
                    className="w-full p-3 pr-12 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] focus:border-[var(--admin-primary)] outline-none font-mono text-sm"
                    placeholder="VD: 300"
                    value={deposit === 0 ? '' : deposit} 
                    onChange={e => setDeposit(Number(e.target.value))}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm pointer-events-none select-none">.000</div>
                </div>
                {deposit > 0 && (
                  <div className="text-right mt-1">
                    <span className="text-xs text-[var(--admin-sub)]">
                      Thực tế: <span className="ml-1 font-bold text-[var(--admin-fg)]">{(deposit * 1000).toLocaleString('vi-VN')} đ</span>
                    </span>
                  </div>
                )}
             </div>
             {/* Ghi chú */}
             <div>
                <label className="text-xs font-bold text-[var(--admin-sub)] uppercase mb-2 block">Ghi chú</label>
                <input 
                    className="w-full p-3 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] focus:border-[var(--admin-primary)] outline-none text-sm"
                    placeholder="..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
             </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: SUMMARY & ACTIONS --- */}
        <div className="w-full md:w-80 bg-[var(--admin-bg)] border-t md:border-t-0 md:border-l border-[var(--admin-border)] p-6 flex flex-col justify-between">
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-[var(--admin-sub)] uppercase tracking-wider">Chi tiết thanh toán</h3>
                
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-[var(--admin-sub)]">Tiền phòng ({durationHours.toFixed(1)}h)</span>
                        <span className="font-medium text-[var(--admin-fg)]">{new Intl.NumberFormat('vi-VN').format(roomTotal)}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[var(--admin-sub)]">Dịch vụ</span>
                        <span className="font-medium text-[var(--admin-fg)]">{new Intl.NumberFormat('vi-VN').format(servicesTotal)}đ</span>
                    </div>
                    <div className="border-t border-[var(--admin-border)] my-2"></div>
                    <div className="flex justify-between text-base font-bold">
                        <span className="text-[var(--admin-fg)]">TỔNG CỘNG</span>
                        <span className="text-[var(--admin-primary)] text-lg">{new Intl.NumberFormat('vi-VN').format(grandTotal)}đ</span>
                    </div>
                    {deposit > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Đã cọc</span>
                            <span>-{new Intl.NumberFormat('vi-VN').format(deposit * 1000)}đ</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 space-y-3">
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[var(--admin-primary)] text-white rounded-xl font-bold hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isSubmitting ? <Loader2 className="animate-spin"/> : <Check size={18}/>}
                    Xác nhận Đặt Lịch
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-3 border border-[var(--admin-border)] text-[var(--admin-sub)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-hover)] rounded-xl font-medium transition-colors"
                >
                    Hủy bỏ
                </button>
            </div>
        </div>

      </div>
    </ModalPortal>
  );
}