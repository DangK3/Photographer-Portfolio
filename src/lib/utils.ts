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
    pricePerHour: number,
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

    // 1. Logic Check-in Sớm
    if (actualIn) {
        const earlyMinutes = differenceInMinutes(bookedStart, actualIn);
        earlyFee.minutes = earlyMinutes;

        if (earlyMinutes > settings.earlyGrace) {
            // Logic: Làm tròn lên mỗi 15p
            const billableMinutes = Math.ceil(earlyMinutes / 15) * 15;
            const billableHours = billableMinutes / 60;
            
            earlyFee.isBillable = true;
            earlyFee.billableHours = billableHours;
            earlyFee.amount = billableHours * pricePerHour;
            
            // SỬ DỤNG formatDuration để hiển thị
            earlyFee.message = `Sớm ${formatDuration(earlyMinutes)} (Tính ${billableHours}h)`;
            
            totalSurcharge += earlyFee.amount;
        }
    }

    // 2. Logic OT (Check-out Trễ)
    const checkOutTime = actualOut || new Date(); 
    if (checkOutTime > bookedEnd) {
        const otMinutes = differenceInMinutes(checkOutTime, bookedEnd);
        otFee.minutes = otMinutes;

        if (otMinutes > settings.otFree) {
            // Logic: Tính tròn giờ (làm tròn xuống)
            const otHours = Math.floor(otMinutes / 60);
            
            if (otHours > 0) {
                otFee.isBillable = true;
                otFee.billableHours = otHours;
                otFee.amount = otHours * pricePerHour;

                // SỬ DỤNG formatDuration để hiển thị
                otFee.message = `Trễ ${formatDuration(otMinutes)} (Tính ${otHours}h)`;
                
                totalSurcharge += otFee.amount;
            }
        }
    }

    return { 
        totalSurcharge, 
        earlyFee, 
        otFee 
    };
};