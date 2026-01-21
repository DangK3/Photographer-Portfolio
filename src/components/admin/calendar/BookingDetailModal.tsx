// src/components/admin/calendar/BookingDetailModal.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Check, Trash2, Plus, DollarSign, User, FileText, RotateCcw, Loader2, Camera, Coffee, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import ModalPortal from '@/components/ui/ModalPortal';
import { getBookingDetails, addBookingService, removeBookingService, checkInCustomer, checkOutCustomer, confirmPayment, finalizeBooking } from '@/lib/actions/booking-details';
import { ServiceItem } from '@/lib/actions/studio';
import { format } from 'date-fns';
import { calculateBilling, fmtMoney, formatDuration } from '@/lib/utils';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number | null;
  servicesList: ServiceItem[];
}

interface BookingItemDetail {
    booking_item_id: number;
    room_id: number;
    start_dt: string;
    end_dt: string;
    price_snapshot: number;
    rooms: {
        name: string | null;
        code: string | null;
    } | null;
}

interface BookingServiceDetail {
    booking_service_id: number;
    quantity: number;
    unit_price_snapshot: number;
    computed_amount: number;
    type: string;
    services: {
        name: string;
        unit: string;
        price: number;
        category: string;
    } | null;
}

interface BookingDetail {
    booking_id: number;
    status: string;
    deposit_amount: number;
    check_in_at?: string;
    check_out_at?: string;
    customers: {
        full_name: string | null;
        phone: string | null;
    } | null;
    booking_items: BookingItemDetail[];       
    booking_services: BookingServiceDetail[]; 
}

// Định nghĩa kiểu dữ liệu cho BillingInfo
interface FeeDetail {
    isBillable: boolean;
    minutes: number;
    billableHours: number;
    amount: number;
    message: string;
}

interface BillingInfo {
    totalSurcharge: number;
    earlyFee: FeeDetail;
    otFee: FeeDetail;
    surchargeMessages?: string[];
}

// Giá trị mặc định để tránh lỗi undefined
const DEFAULT_FEE: FeeDetail = {
    isBillable: false,
    minutes: 0,
    billableHours: 0,
    amount: 0,
    message: ''
};

const DEFAULT_BILLING: BillingInfo = {
    totalSurcharge: 0,
    earlyFee: DEFAULT_FEE,
    otFee: DEFAULT_FEE
};

export default function BookingDetailModal({ isOpen, onClose, bookingId, servicesList }: BookingDetailModalProps) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State Tabs
  const [activeTab, setActiveTab] = useState<'equipment' | 'fnb' | 'surcharge'>('equipment');
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [otPrice] = useState(300000); // Giá OT mặc định

  const fetchDetails = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    const res = await getBookingDetails(bookingId);
    if (res.success) {
        setBooking(res.data as unknown as BookingDetail);
    } else {
        toast.error(res.error);
    }
    setLoading(false);
  }, [bookingId]);

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchDetails();
    } else {
        setBooking(null);
    }
  }, [isOpen, bookingId, fetchDetails]);

  // --- ACTIONS ---
  const handleCheckIn = async () => {
      if (!booking || !booking.booking_items || booking.booking_items.length === 0) return;
      const roomId = booking.booking_items[0].room_id; 
      const bookedStart = booking.booking_items[0].start_dt;
      
      const res = await checkInCustomer(booking.booking_id, roomId, bookedStart);
      if(res.success) { toast.success("Checked-in thành công!"); fetchDetails(); }
      else toast.error(res.error);
  }

  const handleCheckOut = async () => {
      if (!booking) return;
      const res = await checkOutCustomer(booking.booking_id);
      if(res.success) { toast.success("Đã dừng giờ (Check-out)!"); fetchDetails(); }
      else toast.error(res.error);
  }

  const handlePayment = async (totalToPay: number) => {
      if (!booking) return;
      if(!confirm(`Xác nhận khách đã thanh toán ${fmtMoney(totalToPay)}?`)) return;

      const res = await confirmPayment(booking.booking_id, totalToPay);
      if(res.success) { toast.success("Thanh toán thành công!"); fetchDetails(); }
      else toast.error(res.error);
  }

  const handleFinalize = async () => {
      if (!booking) return;
      const res = await finalizeBooking(booking.booking_id);
      if(res.success) { toast.success("Đơn hàng đã đóng!"); fetchDetails(); onClose(); }
      else toast.error(res.error);
  }

  const handleAddService = async () => {
     if (!selectedServiceId || !booking) return;
     const service = servicesList.find(s => s.service_id === Number(selectedServiceId));
     if (!service) return;

     const res = await addBookingService(booking.booking_id, service.service_id, qty, service.price);
     if (res.success) {
         toast.success("Đã thêm dịch vụ");
         setIsAddingService(false);
         fetchDetails();
     } else {
         toast.error(res.error);
     }
  };

  const handleRemoveService = async (id: number) => {
      const res = await removeBookingService(id);
      if (res.success) {
          toast.success("Đã xóa");
          fetchDetails();
      }
  };

  // --- LOGIC TÍNH TOÁN ---
  // 1. Lấy thông tin OT/Checkin sớm từ utils
  const billingInfo: BillingInfo = booking && booking.booking_items.length > 0 ? calculateBilling(
    new Date(booking.booking_items[0].start_dt),
    new Date(booking.booking_items[0].end_dt),
    booking.check_in_at ? new Date(booking.check_in_at) : null,
    booking.check_out_at ? new Date(booking.check_out_at) : null,
    otPrice, 
    { earlyGrace: 40, otFree: 60 }
  ) : DEFAULT_BILLING;

  // 2. Tổng hợp tiền
  const calculateTotal = () => {
     if (!booking) return 0;
     const roomTotal = booking.booking_items?.reduce((sum, item) => sum + (item.price_snapshot || 0), 0) || 0;
     const serviceTotal = booking.booking_services?.reduce((sum, s) => sum + (s.computed_amount || 0), 0) || 0;
     const surchargeTotal = billingInfo.totalSurcharge || 0;

     return roomTotal + serviceTotal + surchargeTotal;
  };

  const dropdownServices = servicesList.filter(s => s.category === activeTab);
  
  const totalAmount = calculateTotal();
  const deposit = booking?.deposit_amount || 0;
  const remaining = totalAmount - deposit;

  // Tạo mảng thông báo surcharge để hiển thị
  const surchargeMessages = [];
  if (billingInfo.earlyFee.message) surchargeMessages.push(billingInfo.earlyFee.message);
  if (billingInfo.otFee.message) surchargeMessages.push(billingInfo.otFee.message);

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose} title={`Chi tiết đơn #${bookingId}`} className="max-w-4xl">
       {loading || !booking ? (
           <div className="p-10 flex justify-center items-center">
               <Loader2 className="animate-spin" />
           </div>
       ) : (
           <div className="flex flex-col md:flex-row h-[80vh] md:h-auto">
               
               {/* CỘT TRÁI */}
               <div className="flex-1 p-6 overflow-y-auto bg-[var(--admin-bg)]/50 space-y-6">
                   
                   {/* 1. HEADER INFO & STATUS TAG */}
                   <div className="flex justify-between items-start">
                       <div>
                           <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-[var(--admin-fg)]">{booking.customers?.full_name}</h2>
                                <button 
                                   onClick={fetchDetails}
                                   className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors cursor-pointer"
                                   title="Làm mới dữ liệu"
                                >
                                   <RotateCcw size={14} />
                                </button>
                           </div>
                           <div className="text-sm text-[var(--admin-sub)] flex items-center gap-1"><User size={14}/> {booking.customers?.phone}</div>
                       </div>
                       <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                booking.status === 'checked_in' ? 'bg-green-100 text-green-700' : 
                                booking.status === 'checked_out' ? 'bg-red-100 text-red-700' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                booking.status === 'paid' ? 'bg-purple-100 text-purple-700' :
                                booking.status === 'completed' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {booking.status === 'checked_in' ? 'Khách đang ở Stu' :
                                 booking.status === 'checked_out' ? 'Khách đã rời Stu' :
                                 booking.status === 'paid' ? 'Đã thanh toán' :
                                 booking.status === 'confirmed' ? 'Đã xác nhận' :
                                 booking.status}
                            </span>
                       </div>
                   </div>

                   {/* 2. TIMELINE */}
                   <div className="bg-[var(--admin-card)] p-4 rounded-xl border border-[var(--admin-border)] shadow-sm">
                        <div className="grid grid-cols-2 gap-6 mb-2">
                            <div className="space-y-4 border-r border-[var(--admin-border)] pr-4">
                                {booking.booking_items.map(item => (
                                    <div key={item.booking_item_id}>
                                        <div className="font-bold text-sm text-[var(--admin-fg)] mb-1">{item.rooms?.name}</div>
                                        <div className="flex justify-between text-xs">
                                            <div>
                                                <div className="text-[10px] text-[var(--admin-sub)] uppercase">Giờ đặt lịch</div>
                                                <div className="font-bold">{format(new Date(item.start_dt), 'HH:mm')}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-[var(--admin-sub)] uppercase">Giờ kết lịch</div>
                                                <div className="font-bold">{format(new Date(item.end_dt), 'HH:mm')}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs">
                                    <div>
                                        <div className="text-[10px] text-[var(--admin-sub)] uppercase flex items-center gap-1"><LogIn size={10}/> Check-in</div>
                                        <div className={`font-bold ${booking.check_in_at ? 'text-green-600' : 'text-gray-400'}`}>
                                            {booking.check_in_at ? format(new Date(booking.check_in_at), 'HH:mm') : '--:--'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-[var(--admin-sub)] uppercase flex items-center gap-1"><LogOut size={10}/> Check-out</div>
                                        <div className={`font-bold ${booking.check_out_at ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {booking.check_out_at ? format(new Date(booking.check_out_at), 'HH:mm') : '--:--'}
                                        </div>
                                    </div>
                                </div>
                                {surchargeMessages.length > 0 && (
                                    <div className="bg-[var(--admin-card)] mt-3 text-xs text-[var(--admin-primary)]">
                                        {surchargeMessages.map((msg, idx) => (
                                            <div key={idx}>• {msg}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                   </div>

                   {/* 3. DỊCH VỤ (TABS) */}
                   <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
                       <div className="flex border-b border-[var(--admin-border)]">
                           <button onClick={() => setActiveTab('equipment')} className={`flex-1 py-3 text-xs font-bold uppercase flex justify-center gap-2 cursor-pointer ${activeTab === 'equipment' ? 'bg-[var(--admin-bg)] text-[var(--admin-primary)] border-b-2 border-[var(--admin-primary)]' : 'text-[var(--admin-sub)]'}`}>
                               <Camera size={14}/> Thiết bị
                           </button>
                           <button onClick={() => setActiveTab('fnb')} className={`flex-1 py-3 text-xs font-bold uppercase flex justify-center gap-2 cursor-pointer ${activeTab === 'fnb' ? 'bg-[var(--admin-bg)] text-[var(--admin-primary)] border-b-2 border-[var(--admin-primary)]' : 'text-[var(--admin-sub)]'}`}>
                               <Coffee size={14}/> F&B
                           </button>
                           <button onClick={() => setActiveTab('surcharge')} className={`flex-1 py-3 text-xs font-bold uppercase flex justify-center gap-2 cursor-pointer ${activeTab === 'surcharge' ? 'bg-[var(--admin-bg)] text-[var(--admin-primary)] border-b-2 border-[var(--admin-primary)]' : 'text-[var(--admin-sub)]'}`}>
                               <AlertCircle size={14}/> Phụ phí
                           </button>
                       </div>

                       <div className="p-4">
                           <div className="flex justify-between items-center mb-3">
                               <div className="text-xs font-bold text-[var(--admin-sub)] uppercase">Danh sách {activeTab}</div>
                               {booking.status !== 'completed' && booking.status !== 'paid' && (
                                   <button onClick={() => setIsAddingService(!isAddingService)} className="text-[10px] bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] px-2 py-1 rounded font-bold flex items-center gap-1 cursor-pointer hover:bg-[var(--admin-primary)]/20 transition-colors">
                                       <Plus size={12}/> {isAddingService ? 'Đóng' : 'Thêm'}
                                   </button>
                               )}
                           </div>

                           {isAddingService && (
                               <div className="bg-[var(--admin-bg)] p-3 rounded border border-[var(--admin-border)] mb-3 animate-fade-in-up">
                                   <div className="flex gap-2 mb-2">
                                       <select className="flex-1 p-1 text-sm border rounded bg-[var(--admin-card)]" 
                                               value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)}>
                                           <option value="">-- Chọn dịch vụ --</option>
                                           {dropdownServices.map((s) => (
                                               <option key={s.service_id} value={s.service_id}>{s.name} - {fmtMoney(s.price)}</option>
                                           ))}
                                       </select>
                                       <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} className="w-12 text-center border rounded bg-[var(--admin-card)] text-sm"/>
                                   </div>
                                   <div className="flex justify-end gap-2">
                                       <button onClick={handleAddService} className="text-xs bg-[var(--admin-fg)] text-[var(--admin-bg)] px-3 py-1 rounded font-bold">Lưu</button>
                                   </div>
                               </div>
                           )}

                           <div className="space-y-2 max-h-40 overflow-y-auto table-scrollbar">
                               {booking.booking_services
                                   ?.filter(s => s.services?.category === activeTab)
                                   .map((s) => (
                                   <div key={s.booking_service_id} className="flex justify-between items-center p-2 border-b border-[var(--admin-border)] last:border-0">
                                       <div>
                                           <div className="text-sm font-medium">{s.services?.name}</div>
                                           <div className="text-xs text-[var(--admin-sub)]">{s.quantity} x {fmtMoney(s.unit_price_snapshot || 0)}</div>
                                       </div>
                                       <div className="flex items-center gap-3">
                                           <span className="text-sm font-mono">{fmtMoney(s.computed_amount || 0)}</span>
                                           {booking.status !== 'completed' && booking.status !== 'paid' && (
                                                <button onClick={() => handleRemoveService(s.booking_service_id)} className="text-[var(--admin-sub)] hover:text-red-500">
                                                    <Trash2 size={14}/>
                                                </button>
                                           )}
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>
               </div>

               {/* CỘT PHẢI: BILL & ACTIONS */}
               <div className="w-full md:w-96 bg-[var(--admin-card)] border-l border-[var(--admin-border)] p-6 flex flex-col justify-between shadow-xl z-10">
                   <div>
                       <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--admin-border)]">
                           <FileText size={20} className="text-[var(--admin-primary)]"/>
                           <h3 className="font-bold text-[var(--admin-fg)] uppercase tracking-widest">Hóa Đơn</h3>
                       </div>

                       <div className="bg-[var(--admin-bg)]/30 p-4 rounded-xl border border-[var(--admin-border)] space-y-3 font-mono text-sm">
                            
                            {/* 1. TIỀN PHÒNG & DỊCH VỤ (CỐ ĐỊNH) */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--admin-sub)] font-medium">Tiền phòng</span>
                                    <span className="font-bold text-[var(--admin-fg)]">
                                        {fmtMoney(booking.booking_items?.reduce((a, b) => a + (b.price_snapshot || 0), 0) || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--admin-sub)] font-medium">Dịch vụ</span>
                                    <span className="font-bold text-[var(--admin-fg)]">
                                        {fmtMoney(booking.booking_services?.reduce((a, b) => a + (b.computed_amount || 0), 0) || 0)}
                                    </span>
                                </div>
                            </div>

                            {/* 2. PHỤ PHÍ THỜI GIAN (CHECK-IN/OUT) */}
                            {(booking.check_in_at || booking.check_out_at) && (
                                <div className="border-t border-dashed border-[var(--admin-border)] pt-2 space-y-2">
                                    
                                    {/* Check-in Sớm */}
                                    {booking.check_in_at && (
                                        <div className={`rounded-lg p-2 text-xs bg ${billingInfo.earlyFee.isBillable ? 'border border-orange-100' : 'bg-transparent'}`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-1.5 text-[var(--admin-sub)]">
                                                    <LogIn size={12} className="text-[var(--admin-fg)]"/>
                                                    <span className="text-[var(--admin-fg)]">Vào: <strong className="text-[var(--admin-fg)]">{format(new Date(booking.check_in_at), 'HH:mm')}</strong></span>
                                                </div>
                                                {/* Tag trạng thái */}
                                                {billingInfo.earlyFee.minutes > 0 && (
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${billingInfo.earlyFee.isBillable ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                        {billingInfo.earlyFee.isBillable ? 'Phụ thu' : 'Miễn phí'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Dòng tính tiền Check-in sớm */}
                                            {billingInfo.earlyFee.isBillable && (
                                                <div className="flex justify-between items-start pl-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-orange-700 font-medium">+ Check-in sớm {formatDuration(billingInfo.earlyFee.minutes)}</span>
                                                        <span className="text-[10px] text-orange-600/70">
                                                            ({formatDuration(billingInfo.earlyFee.billableHours * 60)} x {fmtMoney(otPrice)})
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-orange-700">{fmtMoney(billingInfo.earlyFee.amount)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* OT (Check-out Trễ) */}
                                    {booking.check_out_at && (
                                        <div className={`rounded-lg p-2 text-xs ${billingInfo.otFee.isBillable ? 'border border-red-100' : 'bg-transparent'}`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-1.5 text-[var(--admin-sub)]">
                                                    <LogOut size={12} className="text-[var(--admin-fg)]"/>
                                                    <span className="text-[var(--admin-fg)]">Ra: <strong className="text-[var(--admin-fg)]">{format(new Date(booking.check_out_at), 'HH:mm')}</strong></span>
                                                </div>
                                                {/* Tag trạng thái */}
                                                {billingInfo.otFee.minutes > 0 && (
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${billingInfo.otFee.isBillable ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                        {billingInfo.otFee.isBillable ? 'Phụ thu' : 'Miễn phí'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Dòng tính tiền OT */}
                                            {billingInfo.otFee.isBillable && (
                                                <div className="flex justify-between items-start pl-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-red-700 font-medium">+ OT {formatDuration(billingInfo.otFee.minutes)}</span>
                                                        <span className="text-[10px] text-red-600/70">
                                                            ({formatDuration(billingInfo.otFee.billableHours * 60)} x {fmtMoney(otPrice)})
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-red-700">{fmtMoney(billingInfo.otFee.amount)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 3. ĐÃ CỌC & TỔNG KẾT */}
                            <div className="border-t border-[var(--admin-border)] pt-3 space-y-3">
                                <div className="flex justify-between items-center text-green-600 text-xs font-medium">
                                    {fmtMoney(deposit) !== '0 VNĐ' ? (
                                        <>
                                        <span>Đã cọc trước</span>
                                        <span>- {fmtMoney(deposit)}</span>
                                        </>
                                    ) : (
                                        <span>Chưa cọc</span>
                                    )}
                                    </div>

                                <div className="flex justify-between items-center bg-[var(--admin-primary)]/5 p-3 rounded-lg border border-[var(--admin-primary)]/20">
                                    <span className="text-base font-bold text-[var(--admin-primary)] uppercase tracking-tight">Cần thanh toán</span>
                                    <span className="text-xl font-extrabold text-[var(--admin-primary)]">
                                        {fmtMoney(remaining)}
                                    </span>
                                </div>
                            </div>
                        </div>
                   </div>

                   {/* ACTIONS BUTTONS */}
                   <div className="space-y-3 mt-8">
                       {/* 1. CHECK-IN */}
                       {booking.status === 'confirmed' && (
                           <button onClick={handleCheckIn} className="w-full py-4 bg-green-600 text-white rounded-xl 
                           font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex justify-center items-center gap-2 cursor-pointer">
                               <LogIn size={20}/> CHECK-IN KHÁCH
                           </button>
                       )}

                       {/* 2. CHECK-OUT */}
                       {booking.status === 'checked_in' && (
                           <button onClick={handleCheckOut} className="w-full py-4 text-white rounded-xl 
                           font-bold shadow-lg transition-all flex justify-center items-center gap-2 cursor-pointer">
                               <LogOut size={20}/> KHÁCH RỜI (DỪNG GIỜ)
                           </button>
                       )}

                       {/* 3. THANH TOÁN */}
                       {booking.status === 'checked_out' && (
                           <div className="space-y-2">
                               <button onClick={() => handlePayment(remaining)} className="w-full py-4 bg-[var(--admin-primary)] text-white rounded-xl font-bold 
                               shadow-lg hover:opacity-90 flex justify-center items-center gap-2 cursor-pointer">
                                   <DollarSign size={20}/> XÁC NHẬN ĐÃ THU TIỀN
                               </button>
                           </div>
                       )}

                       {/* 4. HOÀN TẤT */}
                       {booking.status === 'paid' && (
                           <div className="space-y-2">
                               <div className="text-center text-xs text-blue-600 font-medium bg-blue-50 p-2 rounded">
                                   Đã thanh toán. Kiểm tra phòng và đóng đơn.
                               </div>
                               <button onClick={handleFinalize} className="w-full py-3 border border-gray-300 bg-white text-gray-700 rounded-xl 
                               font-bold hover:bg-gray-50 flex justify-center items-center gap-2 cursor-pointer">
                                   <Check size={20}/> HOÀN TẤT ĐƠN
                               </button>
                           </div>
                       )}

                       {booking.status === 'completed' && (
                           <div className="bg-gray-100 text-gray-500 text-center py-3 rounded-xl font-bold text-sm border border-gray-200">
                               ĐƠN ĐÃ HOÀN TẤT
                           </div>
                       )}

                        {booking.status !== 'completed' && (
                            <button onClick={onClose} className="w-full py-3 text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] 
                            rounded-xl font-medium transition-colors cursor-pointer">
                                Đóng
                            </button>
                        )}
                   </div>
               </div>
           </div>
       )}
    </ModalPortal>
  );
}