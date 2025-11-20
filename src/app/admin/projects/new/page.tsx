// src/app/admin/projects/new/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../../../../../lib/supabase';
import { compressImage } from '@/lib/image-utils';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save, 
  Loader2, 
  ImagePlus 
} from 'lucide-react';


// Helper: Hàm tạo Slug từ tiếng Việt
const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    + '-' + Date.now(); // Thêm timestamp để đảm bảo KHÔNG TRÙNG lặp
};

// --- 1. Định nghĩa Interfaces chuẩn ---
interface Category {
  category_id: number;
  name: string;
}

interface ProjectImageInsert {
  project_id: number;
  image_url: string;
  display_order: number;
}

// Helper: Hàm trích xuất thông báo lỗi an toàn từ biến unknown
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  
  if (typeof error === 'object' && error !== null) {
    // Kiểm tra các trường lỗi thường gặp của Supabase
    if ('message' in error) return String((error as { message: unknown }).message);
    if ('error_description' in error) return String((error as { error_description: unknown }).error_description);
    if ('details' in error) return String((error as { details: unknown }).details);
  }
  
  return 'Đã xảy ra lỗi không xác định';
};

export default function NewProjectPage() {
  const router = useRouter();
  
  // --- State Quản lý Form ---
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    description: '',
    category_id: '',
    is_featured: false,
  });

  // --- State Quản lý Ảnh ---
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Ref để reset input file
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // 1. Lấy danh sách Category khi vào trang
  useEffect(() => {
    const fetchCategories = async () => {
      // Ép kiểu data trả về thành Category[]
      const { data, error } = await supabase
        .from('portfolio_categories')
        .select('category_id, name')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) {
        toast.error('Lỗi tải danh mục: ' + error.message);
      } else if (data) {
        // Dùng unknown làm bước đệm an toàn nếu Type Supabase chưa được generate
        setCategories(data as unknown as Category[]);
      }
    };
    fetchCategories();
  }, []);

  // 2. Xử lý chọn Ảnh Đại Diện (Thumbnail)
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // 3. Xử lý chọn Ảnh Gallery (Nhiều ảnh)
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setGalleryFiles(prev => [...prev, ...files]);
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Xóa ảnh khỏi danh sách chờ upload
  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // 4. Hàm Upload ảnh lên Supabase Storage
  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    try {
      // Nén ảnh trước khi up
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, { type: 'image/webp' });

      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

      const { error } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, compressedFile);

      if (error) throw error;

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);
        
      return data.publicUrl;
    } catch (error: unknown) {
      console.error('Upload error:', getErrorMessage(error));
      return null;
    }
  };

  // 5. Xử lý Submit Form (Lưu tất cả)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate cơ bản
    if (!formData.title || !formData.category_id) {
      toast.warning('Vui lòng nhập Tên dự án và chọn Danh mục');
      return;
    }
    if (!thumbnailFile) {
      toast.warning('Vui lòng chọn ảnh đại diện (Thumbnail)');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Đang xử lý dữ liệu...');

    try {
      // --- BƯỚC 0: Lấy thông tin người dùng đang đăng nhập ---
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser || !authUser.email) {
        throw new Error('Bạn chưa đăng nhập hoặc phiên làm việc hết hạn.');
      }

      // Tìm user_id trong bảng public.users dựa trên email
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('user_id')
        .eq('email', authUser.email)
        .single();

      if (profileError || !userProfile) {
        throw new Error('Không tìm thấy hồ sơ nhân viên liên kết với email này.');
      }

      const currentUserId = userProfile.user_id;

      // --- BƯỚC A: Upload Thumbnail ---
      const thumbnailUrl = await uploadImage(thumbnailFile, 'thumbnails');
      if (!thumbnailUrl) throw new Error('Lỗi upload thumbnail (Kiểm tra lại Storage Policy)');

      // --- BƯỚC B: Tạo Dự án trong Database ---
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: formData.title,
          // THÊM DÒNG NÀY: Tự động tạo slug từ tiêu đề
          slug: generateSlug(formData.title), 
          
          client_name: formData.client_name,
          description: formData.description,
          category_id: parseInt(formData.category_id),
          is_featured: formData.is_featured,
          thumbnail_url: thumbnailUrl,
          created_by: currentUserId 
        })
        .select()
        .single();
        
      if (projectError) throw projectError;

      // Ép kiểu để lấy ID an toàn
      const newProject = projectData as { project_id: number };
      const projectId = newProject.project_id;

      // --- BƯỚC C: Upload Gallery (Nếu có) ---
      if (galleryFiles.length > 0) {
        toast.loading(`Đang upload ${galleryFiles.length} ảnh chi tiết...`, { id: toastId });
        
        const galleryPromises = galleryFiles.map(async (file, index) => {
          const url = await uploadImage(file, 'gallery');
          if (url) {
            // Trả về object đúng kiểu ProjectImageInsert
            return {
              project_id: projectId,
              image_url: url,
              display_order: index
            } as ProjectImageInsert;
          }
          return null;
        });

        // Lọc bỏ null và đảm bảo kiểu dữ liệu
        const uploadedImages = (await Promise.all(galleryPromises)).filter((img): img is ProjectImageInsert => img !== null);

        if (uploadedImages.length > 0) {
          const { error: galleryError } = await supabase
            .from('project_images')
            .insert(uploadedImages);
            
          if (galleryError) throw galleryError;
        }
      }

      toast.success('Thêm dự án thành công!', { id: toastId });
      router.push('/admin/projects');

    } catch (error: unknown) {
      const msg = getErrorMessage(error);
      console.error('🔴 Chi tiết lỗi:', error);
      toast.error(`Thất bại: ${msg}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-[var(--admin-hover)] text-[var(--admin-sub)] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[var(--admin-fg)]">Thêm Dự án Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Card 1: Thông tin chung */}
        <div className="p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-[var(--admin-fg)] border-b border-[var(--admin-border)] pb-4">
            Thông tin cơ bản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Tên Dự án <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all"
                placeholder="Ví dụ: Summer Collection 2024"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Khách hàng / Brand</label>
              <input 
                type="text" 
                className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all"
                placeholder="Ví dụ: Dior, Cá nhân..."
                value={formData.client_name}
                onChange={e => setFormData({...formData, client_name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Danh mục <span className="text-red-500">*</span></label>
              <select 
                required
                className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all"
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3 mt-8">
              <input 
                type="checkbox" 
                id="is_featured"
                className="w-5 h-5 text-[var(--admin-primary)] rounded focus:ring-[var(--admin-primary)] cursor-pointer"
                checked={formData.is_featured}
                onChange={e => setFormData({...formData, is_featured: e.target.checked})}
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-[var(--admin-fg)] cursor-pointer select-none">
                Đánh dấu là <b>Nổi bật</b> (Hiện lên trang chủ)
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--admin-fg)]">Mô tả chi tiết</label>
            <textarea 
              rows={4}
              className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all"
              placeholder="Mô tả về concept, địa điểm, ekip..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        {/* Card 2: Hình ảnh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Thumbnail Upload (1/3) */}
          <div className="md:col-span-1 p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Ảnh đại diện <span className="text-red-500">*</span></h2>
            <p className="text-xs text-[var(--admin-sub)]">Ảnh hiển thị ngoài danh sách (Tỉ lệ 3:4 hoặc 16:9).</p>
            
            <div className="relative aspect-[3/4] w-full bg-[var(--admin-bg)] border-2 border-dashed border-[var(--admin-border)] rounded-lg overflow-hidden hover:border-[var(--admin-primary)] transition-colors group cursor-pointer">
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleThumbnailChange}
              />
              {thumbnailPreview ? (
                <Image src={thumbnailPreview} alt="Thumbnail Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--admin-sub)]">
                  <ImagePlus size={40} className="mb-2 opacity-50" />
                  <span className="text-sm">Chọn ảnh</span>
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-white text-sm font-medium">Thay đổi</span>
              </div>
            </div>
          </div>

          {/* Gallery Upload (2/3) */}
          <div className="md:col-span-2 p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Album ảnh chi tiết</h2>
                <p className="text-xs text-[var(--admin-sub)]">Hiển thị trong trang chi tiết (Masonry Layout).</p>
              </div>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-fg)] rounded-lg hover:bg-[var(--admin-hover)] text-sm transition-colors"
              >
                <Upload size={16} /> Thêm ảnh
              </button>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                className="hidden"
                ref={galleryInputRef}
                onChange={handleGalleryChange}
              />
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
              {galleryPreviews.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--admin-border)] group">
                  <Image src={src} alt={`Gallery ${index}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              {/* Empty State */}
              {galleryPreviews.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-[var(--admin-border)] rounded-lg text-[var(--admin-sub)] bg-[var(--admin-bg)]/50">
                  <ImagePlus size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Chưa có ảnh nào trong album</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-[var(--admin-border)]">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 text-[var(--admin-sub)] font-medium hover:text-[var(--admin-fg)] transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={20} />
                Lưu Dự Án
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}