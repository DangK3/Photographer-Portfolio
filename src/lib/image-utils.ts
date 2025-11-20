// src/lib/image-utils.ts

/**
 * Nén và Resize ảnh trước khi upload
 * @param file File ảnh gốc
 * @param maxWidth Chiều rộng tối đa (mặc định 1920px)
 * @param quality Chất lượng nén (0 - 1, mặc định 0.8)
 */
export const compressImage = async (
  file: File, 
  maxWidth = 1920, 
  quality = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Tính toán kích thước mới giữ nguyên tỷ lệ
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        // Vẽ lên Canvas để resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Không thể tạo context canvas'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Xuất ra Blob dạng WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Lỗi nén ảnh'));
            }
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = (err) => reject(err);
    };
    
    reader.onerror = (err) => reject(err);
  });
};