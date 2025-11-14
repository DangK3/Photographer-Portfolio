// src/lib/constants.ts

/**
 * Cài đặt chung cho các layout dạng grid
 */

// Số lượng item giả cần cho mỗi trang
export const DESIRED_PROJECT_COUNT = 48;

// Số lượng item tải ban đầu khi vào trang
export const INITIAL_LOAD_COUNT = 8;

// Số lượng item tải thêm mỗi lần cuộn
export const LOAD_MORE_COUNT = 8;

export const SLUG_CATE_PERSONAL = 'ca-nhan';
export const SLUG_CATE_COMMERCIAL = 'thuong-mai';
export const SLUG_CATE_FASHION = 'thoi-trang';

// CÔNG TẮC DEMO MODE
// true: Sẽ nhân bản dự án thật để lấp đầy trang (dùng seed-helpers)
// false: Chỉ hiển thị các dự án thật (dùng cho production)
export const IS_DEMO_MODE = true;