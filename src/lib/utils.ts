// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInMinutes } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Hàm format tiền tệ cho gọn
export const fmtMoney = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
};

export const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    
    if (h > 0) {
        return `${h}h${m > 0 ? `${m}p` : ''}`; // Ví dụ: 2h39p hoặc 2h
    }
    return `${m}p`; // Ví dụ: 45p
};
export const calculateBilling = (
    bookedStart: Date,
    bookedEnd: Date,
    actualIn: Date | null,
    actualOut: Date | null,
    pricePerHour: number, // Giá này lấy từ DB Room
    settings: { earlyGrace: number; otFree: number }
) => {
    let totalSurcharge = 0;

    const earlyFee = {
        isBillable: false,
        minutes: 0,
        billableHours: 0,
        amount: 0,
        message: ''
    };

    const otFee = {
        isBillable: false,
        minutes: 0,
        billableHours: 0,
        amount: 0,
        message: ''
    };

    // 1. Logic Check-in Sớm (Giữ nguyên logic 15p của bạn hoặc sửa tùy ý)
    if (actualIn && actualIn < bookedStart) {
        const earlyMinutes = differenceInMinutes(bookedStart, actualIn);
        earlyFee.minutes = earlyMinutes;

        if (earlyMinutes > settings.earlyGrace) {
            // Logic: Làm tròn lên mỗi 15p (Ví dụ 16p -> 30p = 0.5h)
            const billableMinutes = Math.ceil(earlyMinutes / 15) * 15;
            const billableHours = billableMinutes / 60;
            
            earlyFee.isBillable = true;
            earlyFee.billableHours = billableHours;
            earlyFee.amount = billableHours * pricePerHour;
            
            earlyFee.message = `Sớm ${earlyMinutes}p (Tính ${billableHours}h)`;
            totalSurcharge += earlyFee.amount;
        }
    }

    // 2. Logic OT (Check-out Trễ) - SỬA LOGIC THEO YÊU CẦU: BLOCK 30 PHÚT
    const checkOutTime = actualOut || new Date(); 
    if (checkOutTime > bookedEnd) {
        const otMinutes = differenceInMinutes(checkOutTime, bookedEnd);
        otFee.minutes = otMinutes;

        if (otMinutes > settings.otFree) {
            // YÊU CẦU: Tính thấp nhất là nửa tiếng (0.5h)
            // Logic: Chia cho 30, làm tròn lên.
            // VD: 10p -> 1 block (0.5h). 35p -> 2 blocks (1h).
            const blocks = Math.ceil(otMinutes / 30);
            const otHours = blocks * 0.5;
            
            otFee.isBillable = true;
            otFee.billableHours = otHours;
            otFee.amount = otHours * pricePerHour; // Giá OT bằng giá phòng

            otFee.message = `Trễ ${otMinutes}p (Tính ${otHours}h)`;
            totalSurcharge += otFee.amount;
        }
    }

    return { 
        totalSurcharge, 
        earlyFee, 
        otFee 
    };
};
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  // Xử lý object lỗi từ Supabase hoặc object lạ
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Đã có lỗi không xác định xảy ra';
};
