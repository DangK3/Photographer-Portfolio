// src/components/admin/calendar/BookingDetailModal.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo} from 'react';
import { Check, Trash2, Plus, DollarSign, User, FileText, RotateCcw, Loader2, Camera, Coffee, AlertCircle, LogIn, LogOut, Layers } from 'lucide-react';
import { toast } from 'sonner';
import ModalPortal from '@/components/ui/ModalPortal';
import { getBookingDetails, 
    addBookingService, 
    removeBookingService, 
    checkInCustomer, 
    checkOutCustomer, 
    confirmPayment, 
    cancelBooking,
    finalizeBooking } from '@/lib/actions/booking-details';
import { ServiceItem } from '@/lib/actions/studio';
import { calculateBilling, fmtMoney, formatDuration } from '@/lib/utils';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { format, differenceInMinutes } from 'date-fns';

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
// interface FeeDetail {
//     isBillable: boolean;
//     minutes: number;
//     billableHours: number;
//     amount: number;
//     message: string;
// }

// interface BillingInfo {
//     totalSurcharge: number;
//     earlyFee: FeeDetail;
//     otFee: FeeDetail;
//     surchargeMessages?: string[];
// }

// Giá trị mặc định để tránh lỗi undefined
// const DEFAULT_FEE: FeeDetail = {
//     isBillable: false,
//     minutes: 0,
//     billableHours: 0,
//     amount: 0,
//     message: ''
// };

// const DEFAULT_BILLING: BillingInfo = {
//     totalSurcharge: 0,
//     earlyFee: DEFAULT_FEE,
//     otFee: DEFAULT_FEE
// };

export default function BookingDetailModal({ isOpen, onClose, bookingId, servicesList }: BookingDetailModalProps) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isTempDisabled, setIsTempDisabled] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false); // State mở modal thanh toán
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // State loading khi gọi API

  // State Tabs
  const [activeTab, setActiveTab] = useState<'equipment' | 'fnb' | 'surcharge'>('equipment');
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [qty, setQty] = useState(1);
  
  // Fetch Data (Logic chuẩn hiện tại của bạn)
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

  // --- ACTIONS HANDLERS (Giữ nguyên) ---
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

// Hàm này gọi khi người dùng bấm nút "Đồng ý" trên Modal
  const handleConfirmPayment = async () => {
      if (!booking) return;
      
      setIsProcessingPayment(true); // Bật loading

      // Gọi API (biến 'remaining' lấy từ scope tính toán bên dưới)
      const res = await confirmPayment(booking.booking_id, remaining);
      
      setIsProcessingPayment(false); // Tắt loading
      setPaymentModalOpen(false);    // Đóng modal

      if(res.success) { 
          toast.success("Thanh toán thành công!"); 
          setTimeout(() => {
              toast.success("Đã thanh toán. Kiểm tra phòng và đóng đơn."); 
              fetchDetails(); 
          }, 1000);
          fetchDetails(); // Reload lại dữ liệu
      } else { 
          toast.error(res.error); 
      }
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

  const handleCancelClick = () => {
    if (!booking) return;
    const allowCancel = ['pending', 'confirmed'].includes(booking.status);
    if (!allowCancel) {
      toast.error("Không thể huỷ khi khách đã check-in hoặc đơn đã xong!");
      setIsTempDisabled(true);
      setTimeout(() => setIsTempDisabled(false), 3000);
      return; 
    }
    setDeleteModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!booking) return;
    setIsCancelling(true);
    const res = await cancelBooking(booking.booking_id);
    setIsCancelling(false);
    setDeleteModalOpen(false);

    if (res.success) {
      toast.success("Đã huỷ lịch hẹn thành công");
      fetchDetails();
    } else {
      toast.error(res.error);
      fetchDetails();
    }
  };

  // --- LOGIC TÍNH TOÁN & HIỂN THỊ HÓA ĐƠN (UPDATED) ---
  
  // 1. Tính toán dynamic các chỉ số dựa trên state `booking`
// --- LOGIC TÍNH TOÁN & HIỂN THỊ HÓA ĐƠN ---
  const calculationData = useMemo(() => {
    if (!booking || !booking.booking_items || booking.booking_items.length === 0) return null;

    const item = booking.booking_items[0]; 
    
    // Đảm bảo convert sang Date object chuẩn
    const startDate = new Date(item.start_dt);
    const endDate = new Date(item.end_dt);
    
    // 1. Tính thời lượng đặt lịch (Booked Duration)
    // Lưu ý: differenceInMinutes(End, Start) -> Phải để End trước
    const diffMinutes = differenceInMinutes(endDate, startDate);
    
    // 2. Tính tổng tiền phòng (Lấy từ snapshot database)
    const roomTotal = booking.booking_items.reduce((sum, i) => sum + (Number(i.price_snapshot) || 0), 0);
    
    // 3. Tính đơn giá theo giờ (Dynamic Price Per Hour)
    // Nếu book 0 phút (lỗi) -> Fallback về 0 để tránh chia cho 0
    const hours = diffMinutes / 60;
    
    // FIX QUAN TRỌNG: Nếu hours = 0 hoặc roomTotal = 0 thì pricePerHour sẽ sai.
    // Logic fallback: Nếu không chia được, thử lấy giá gốc từ room (nếu bạn có join bảng rooms)
    // Ở đây ta tạm thời handle việc chia cho 0.
    let pricePerHour = 0;
    if (hours > 0) {
        pricePerHour = roomTotal / hours;
    } else {
        // Fallback: Nếu lỗi data (0 phút), tự gán cứng mức giá sàn (ví dụ 100k) hoặc 0
        pricePerHour = 0; 
    }

    // 4. Gọi hàm tính toán phụ phí (OT / Early)
    const billing = calculateBilling(
        startDate,
        endDate,
        booking.check_in_at ? new Date(booking.check_in_at) : null,
        booking.check_out_at ? new Date(booking.check_out_at) : null,
        pricePerHour, // Tham số này quan trọng: Nếu nó bằng 0 -> Tiền OT sẽ bằng 0
        { earlyGrace: 15, otFree: 15 } 
    );

    return {
        roomTotal,
        serviceTotal: booking.booking_services?.reduce((sum, s) => sum + (Number(s.computed_amount) || 0), 0) || 0,
        billing,
        durationDisplay: formatDuration(diffMinutes) // Hàm này sẽ hiển thị đúng số phút
    };
  }, [booking]);

  // Các biến hiển thị UI
  const dropdownServices = servicesList.filter(s => s.category === activeTab);
  
  // Nếu chưa có data thì null hết
  const roomCharge = calculationData?.roomTotal || 0;
  const serviceCharge = calculationData?.serviceTotal || 0;
  const billingInfo = calculationData?.billing;
  const surchargeTotal = billingInfo?.totalSurcharge || 0;
  
  const totalAmount = roomCharge + serviceCharge + surchargeTotal;
  const deposit = booking?.deposit_amount || 0;
  const remaining = Math.max(0, totalAmount - deposit);

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose} title={`Chi tiết đơn #${bookingId}`} className="max-w-4xl">
       {loading || !booking ? (
           <div className="p-10 flex justify-center items-center">
               <Loader2 className="animate-spin" />
           </div>
       ) : (
           <div className="flex flex-col md:flex-row h-[80vh] md:h-auto">
               
               {/* CỘT TRÁI - GIỮ NGUYÊN CODE CŨ CỦA BẠN */}
               <div className="flex-1 p-6 overflow-y-auto bg-[var(--admin-bg)]/50 space-y-6">
                   {/* 1. HEADER */}
                   <div className="flex justify-between items-start">
                       <div>
                           <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-[var(--admin-fg)]">{booking.customers?.full_name}</h2>
                                <button onClick={fetchDetails} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 cursor-pointer" title="Refresh">
                                   <RotateCcw size={14} />
                                </button>
                           </div>
                           <div className="text-sm text-[var(--admin-sub)] flex items-center gap-1"><User size={14}/> {booking.customers?.phone}</div>
                       </div>
                       <div className="text-right">
                            {/* Status Tag Logic giữ nguyên */}
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase 
                                ${booking.status === 'checked_in' ? 'bg-green-100 text-green-700' : 
                                  booking.status === 'cancelled' ? 'bg-gray-200 text-gray-500 line-through' : 'bg-blue-100 text-blue-700'}`}>
                                {booking.status}
                            </span>
                       </div>
                   </div>

                   {/* 2. TIMELINE - GIỮ NGUYÊN */}
                   <div className="bg-[var(--admin-card)] p-4 rounded-xl border border-[var(--admin-border)] shadow-sm">
                        {/* ... Code Timeline cũ của bạn ... */}
                        <div className="grid grid-cols-2 gap-6">
                             {/* Hiển thị giờ đặt vs giờ checkin thực tế */}
                             <div className="space-y-2">
                                <div className="text-xs text-[var(--admin-sub)]">Lịch đặt:</div>
                                <div className="font-bold text-sm">
                                    {format(new Date(booking.booking_items[0].start_dt), 'HH:mm')} - {format(new Date(booking.booking_items[0].end_dt), 'HH:mm')}
                                </div>
                             </div>
                             <div className="space-y-2">
                                <div className="text-xs text-[var(--admin-sub)]">Thực tế:</div>
                                <div className="font-bold text-sm flex gap-2">
                                    <span className={booking.check_in_at ? "text-green-600" : "text-gray-400"}>
                                        {booking.check_in_at ? format(new Date(booking.check_in_at), 'HH:mm') : '--:--'}
                                    </span>
                                    <span>-</span>
                                    <span className={booking.check_out_at ? "text-blue-600" : "text-gray-400"}>
                                        {booking.check_out_at ? format(new Date(booking.check_out_at), 'HH:mm') : '--:--'}
                                    </span>
                                </div>
                             </div>
                        </div>
                   </div>

                   {/* 3. TABS DỊCH VỤ - GIỮ NGUYÊN LOGIC */}
                   <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
                       <div className="flex border-b border-[var(--admin-border)]">
                           {/* ... Các nút Tab ... */}
                           <button 
                                onClick={() => setActiveTab('equipment')} 
                                className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer
                                ${activeTab === 'equipment' 
                                    ? 'text-[var(--admin-primary)] border-b-2 border-[var(--admin-primary)] bg-[var(--admin-primary)]/5' 
                                    : 'text-[var(--admin-sub)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-hover)]'
                                }`}
                            >
                                <Camera size={16} strokeWidth={2.5} /> Thiết bị
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('fnb')} 
                                className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer
                                ${activeTab === 'fnb' 
                                    ? 'text-[var(--admin-primary)] border-b-2 border-[var(--admin-primary)] bg-[var(--admin-primary)]/5' 
                                    : 'text-[var(--admin-sub)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-hover)]'
                                }`}
                            >
                                <Coffee size={16} strokeWidth={2.5} /> Ăn/uống
                            </button>
                            <button 
                                onClick={() => setActiveTab('surcharge')} 
                                className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer
                                ${activeTab === 'surcharge' 
                                    ? 'text-[var(--admin-primary)] border-b-2 border-[var(--admin-primary)] bg-[var(--admin-primary)]/5' 
                                    : 'text-[var(--admin-sub)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-hover)]'
                                }`}
                            >
                                <AlertCircle size={16} strokeWidth={2.5} /> Phụ phí
                            </button>
                       </div>

                       <div className="p-4">
                           <div className="flex justify-between items-center mb-3">
                               <div className="text-xs font-bold text-[var(--admin-sub)] uppercase">Danh sách {activeTab}</div>
                               {booking.status !== 'completed' && booking.status !== 'paid' && (
                                   <button onClick={() => setIsAddingService(!isAddingService)} className="text-[10px] bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] px-2 py-1 rounded font-bold flex items-center gap-1">
                                           <Plus size={12}/> {isAddingService ? 'Đóng' : 'Thêm'}
                                   </button>
                               )}
                           </div>
                           
                           {/* Form thêm dịch vụ */}
                           {isAddingService && (
                               <div className="bg-[var(--admin-bg)] p-3 rounded border mb-3">
                                   <div className="flex gap-2 mb-2">
                                       <select className="flex-1 p-1 text-sm border rounded" value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)}>
                                           <option value="">-- Chọn --</option>
                                           {dropdownServices.map((s) => (
                                               <option key={s.service_id} value={s.service_id}>{s.name} - {fmtMoney(s.price)}</option>
                                           ))}
                                       </select>
                                       <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} className="w-12 text-center border rounded text-sm"/>
                                   </div>
                                   <div className="flex justify-end"><button onClick={handleAddService} className="text-xs bg-black text-white px-2 py-1 rounded">Lưu</button></div>
                               </div>
                           )}

                           {/* List dịch vụ */}
                           <div className="space-y-2 max-h-40 overflow-y-auto">
                               {booking.booking_services?.filter(s => s.services?.category === activeTab).map((s) => (
                                   <div key={s.booking_service_id} className="flex justify-between items-center p-2 border-b last:border-0">
                                       <div>
                                           <div className="text-sm font-medium">{s.services?.name}</div>
                                           <div className="text-xs text-[var(--admin-sub)]">{s.quantity} x {fmtMoney(s.unit_price_snapshot || 0)}</div>
                                       </div>
                                       {booking.status !== 'completed' && booking.status !== 'paid' && booking.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => handleRemoveService(s.booking_service_id)}
                                                className="p-1 hover:bg-red-50 rounded transition-colors"
                                                title="Xóa dịch vụ"
                                            >
                                                <Trash2 size={14} className="text-red-400 hover:text-red-600"/>
                                            </button>
                                        )}
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>
               </div>

               {/* ===================================================================================== */}
               {/* CỘT PHẢI: HÓA ĐƠN & ACTIONS (ĐÃ LÀM MỚI THEO FORM YÊU CẦU) */}
               {/* ===================================================================================== */}
               <div className="w-full md:w-96 bg-[var(--admin-card)] border-l border-[var(--admin-border)] p-6 flex flex-col justify-between shadow-xl z-10">
                   <div>
                       <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--admin-border)]">
                           <FileText size={20} className="text-[var(--admin-primary)]"/>
                           <h3 className="font-bold text-[var(--admin-fg)] uppercase tracking-widest">Hóa Đơn</h3>
                       </div>

                       <div className="bg-[var(--admin-bg)]/30 p-4 rounded-xl border border-[var(--admin-border)] space-y-3 font-mono text-sm">
                           
                           {/* 1. TIỀN PHÒNG */}
                           <div className="flex justify-between items-center">
                               <span className="text-[var(--admin-sub)] font-medium">Tiền phòng ({calculationData?.durationDisplay})</span>
                               <span className="font-bold text-[var(--admin-fg)]">{fmtMoney(roomCharge)}</span>
                           </div>

                           {/* 2. DỊCH VỤ & LIST CHI TIẾT */}
                           <div className="space-y-2">
                               <div className="flex justify-between items-center">
                                   <span className="text-[var(--admin-sub)] font-medium flex items-center gap-1.5">
                                        <Layers size={14} className="opacity-70"/> Dịch vụ
                                    </span>
                                   <span className="font-bold text-[var(--admin-fg)]">{fmtMoney(serviceCharge)}</span>
                               </div>
                               
                               {/* Loop danh sách dịch vụ chi tiết dưới dòng tổng */}
                               {booking.booking_services && booking.booking_services.length > 0 && (
                                   <div className="pl-3 border-l-2 border-[var(--admin-border)] ml-1 space-y-1">
                                       {booking.booking_services.map((s, index) => (
                                           <div key={index} className="flex justify-between items-center text-xs text-[var(--admin-sub)]">
                                               <span>- {s.services?.name || 'Item'} ({s.quantity})</span>
                                               <span>{fmtMoney(s.computed_amount || 0)}</span>
                                           </div>
                                       ))}
                                   </div>
                               )}
                           </div>

                           <div className="border-t border-dashed border-[var(--admin-border)]"></div>

                           {/* 3. GIỜ VÀO RA & PHỤ PHÍ */}
                           <div className="space-y-3">
                               {/* Check-in */}
                               <div className="flex justify-between items-start">
                                    <div className="text-[var(--admin-sub)]">
                                        <div className="font-medium">Giờ vào:</div>
                                        {/* Hiển thị message Early Fee nếu có */}
                                        {billingInfo?.earlyFee?.isBillable && (
                                            <span className="text-xs text-orange-600 block mt-0.5">
                                                + {billingInfo.earlyFee.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[var(--admin-fg)] font-bold">
                                            {booking.check_in_at ? format(new Date(booking.check_in_at), 'HH:mm') : '--:--'}
                                        </div>
                                        {billingInfo?.earlyFee?.isBillable && (
                                            <div className="text-xs text-orange-600 font-bold">+{fmtMoney(billingInfo.earlyFee.amount)}</div>
                                        )}
                                    </div>
                               </div>

                               {/* Check-out */}
                               <div className="flex justify-between items-start">
                                    <div className="text-[var(--admin-sub)]">
                                        <div className="font-medium">Giờ ra:</div>
                                        {/* Hiển thị message OT Fee nếu có */}
                                        {billingInfo?.otFee?.isBillable && (
                                            <span className="text-xs text-red-600 block mt-0.5">
                                                + {billingInfo.otFee.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[var(--admin-fg)] font-bold">
                                            {booking.check_out_at ? format(new Date(booking.check_out_at), 'HH:mm') : '--:--'}
                                        </div>
                                        {billingInfo?.otFee?.isBillable && (
                                            <div className="text-xs text-red-600 font-bold">+{fmtMoney(billingInfo.otFee.amount)}</div>
                                        )}
                                    </div>
                               </div>
                           </div>

                           <div className="border-t-2 border-[var(--admin-border)]"></div>

                           {/* 4. TỔNG KẾT */}
                           <div className="space-y-2">
                               {/* Tổng chi phí */}
                               <div className="flex justify-between items-center text-[var(--admin-fg)]">
                                   <span className="font-bold">Tổng chi phí</span>
                                   <span className="font-bold text-lg">{fmtMoney(totalAmount)}</span>
                               </div>

                               {/* FIX: Hiển thị dòng cọc thông minh hơn */}
                               <div className={`flex justify-between items-center text-sm ${deposit > 0 ? 'text-green-600' : 'text-[var(--admin-sub)]'}`}>
                                   <span>{deposit > 0 ? 'Đã trừ cọc' : 'Đặt cọc'}</span>
                                   <span className="font-medium">
                                       {deposit > 0 ? `-${fmtMoney(deposit)}` : 'Chưa cọc'}
                                   </span>
                               </div>

                               {/* Cần thanh toán */}
                               <div className="flex justify-between items-center bg-[var(--admin-primary)]/10 p-3 rounded-lg border border-[var(--admin-primary)]/20 mt-2">
                                   <span className="text-sm font-bold text-[var(--admin-primary)] uppercase">Cần thanh toán</span>
                                   <span className="text-xl font-extrabold text-[var(--admin-primary)]">
                                       {fmtMoney(remaining)}
                                   </span>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* ACTIONS BUTTONS */}
                   <div className="space-y-3 mt-6">
                       {booking.status === 'confirmed' && (
                           <button onClick={handleCheckIn} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex justify-center items-center gap-2">
                               <LogIn size={20}/> CHECK-IN KHÁCH
                           </button>
                       )}
                       
                       {booking.status === 'checked_in' && (
                           <button onClick={handleCheckOut} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                               <LogOut size={20}/> KHÁCH RỜI (DỪNG GIỜ)
                           </button>
                       )}

                       {booking.status === 'checked_out' && (
                           <button onClick={() => setPaymentModalOpen(true)} className="w-full py-4 bg-[var(--admin-fg)] text-[var(--admin-card)] rounded-xl font-bold shadow-lg hover:opacity-90 flex justify-center items-center gap-2">
                               <DollarSign size={20}/> XÁC NHẬN ĐÃ THU TIỀN
                           </button>
                       )}

                       {booking.status === 'paid' && (
                           <div className="space-y-2">
                               <button onClick={handleFinalize} className="w-full py-3 border border-gray-300 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 flex justify-center items-center gap-2">
                                   <Check size={20}/> HOÀN TẤT ĐƠN
                               </button>
                           </div>
                       )}
                       
                       {/* Nút Huỷ */}
                       {booking.status !== 'completed' && booking.status !== 'cancelled' && booking.status !== 'paid' && (
                            <button
                               onClick={handleCancelClick}
                               disabled={isTempDisabled}
                               className={`w-full py-3 rounded-xl font-medium border flex justify-center items-center gap-2 transition-all
                               ${isTempDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-red-200 text-red-500 hover:bg-red-50'}`}
                           >
                               <Trash2 size={18} /> Huỷ Booking
                           </button>
                       )}

                       <button onClick={onClose} className="w-full py-3 text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] rounded-xl font-medium cursor-pointer">
                           Đóng
                       </button>

                       <ConfirmModal 
                           isOpen={deleteModalOpen}
                           onClose={() => !isCancelling && setDeleteModalOpen(false)}
                           onConfirm={handleConfirmCancel}
                           title="Xác nhận huỷ lịch hẹn"
                           description={`Bạn có chắc chắn muốn huỷ lịch của "${booking.customers?.full_name || 'khách này'}"?`}
                           confirmText={isCancelling ? "Đang huỷ..." : "Đồng ý huỷ"}
                           cancelText="Đóng"
                           variant="danger"
                           isLoading={isCancelling}
                       />
                       <ConfirmModal 
                            isOpen={paymentModalOpen}
                            onClose={() => !isProcessingPayment && setPaymentModalOpen(false)}
                            onConfirm={handleConfirmPayment} // Gọi hàm xử lý API
                            title="Xác nhận thanh toán"
                            description={`Xác nhận khách hàng đã thanh toán đủ số tiền ${fmtMoney(remaining)}? Hành động này sẽ chuyển trạng thái đơn sang 'Đá thanh toán'.`}
                            confirmText={isProcessingPayment ? "Đang xử lý..." : "Xác nhận đã thu"}
                            cancelText="Đóng"
                            variant="info" // Dùng màu xanh/info thay vì danger
                            isLoading={isProcessingPayment}
                        />
                   </div>
               </div>
           </div>
       )}
    </ModalPortal>
  );
}