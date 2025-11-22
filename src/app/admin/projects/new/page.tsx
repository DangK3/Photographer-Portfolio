// src/app/admin/projects/new/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../../../../../lib/supabase';
import { compressImage } from '@/lib/image-utils';
import { toast } from 'sonner';
import { 
  ArrowLeft, Upload, X, Save, Loader2, ImagePlus, Plus, Type, AlignLeft, Trash2 
} from 'lucide-react';

// --- Interfaces ---
interface Category {
  category_id: number;
  name: string;
}

// Kiểu dữ liệu cho Form Builder
type BlockType = 'heading' | 'paragraph' | 'imageRow';

interface ContentBlock {
  id: string; // ID tạm để quản lý UI
  type: BlockType;
  content?: string; // Dùng cho Heading/Paragraph
  images?: File[]; // Dùng cho ImageRow (File chưa upload)
  previews?: string[]; // Preview ảnh
}

interface CreditItem {
  label: string;
  value: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form cơ bản
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    description: '',
    category_id: '',
    is_featured: false,
  });

  // Thumbnail
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // --- 1. QUẢN LÝ CREDITS ---
  const [credits, setCredits] = useState<CreditItem[]>([
    { label: 'Photographer', value: '' }, // Mặc định có 1 dòng
  ]);

  const addCredit = () => setCredits([...credits, { label: '', value: '' }]);
  const removeCredit = (index: number) => setCredits(credits.filter((_, i) => i !== index));
  const updateCredit = (index: number, field: keyof CreditItem, value: string) => {
    const newCredits = [...credits];
    newCredits[index][field] = value;
    setCredits(newCredits);
  };

  // --- 2. QUẢN LÝ NỘI DUNG BÀI VIẾT (BUILDER) ---
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const addBlock = (type: BlockType) => {
    setBlocks([
      ...blocks, 
      { id: Math.random().toString(36).substr(2, 9), type, content: '', images: [], previews: [] }
    ]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const handleBlockImagesChange = (id: string, files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));

    setBlocks(blocks.map(b => {
      if (b.id === id) {
        return {
          ...b,
          images: [...(b.images || []), ...newFiles],
          previews: [...(b.previews || []), ...newPreviews]
        };
      }
      return b;
    }));
  };

  // Load Categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('portfolio_categories')
        .select('category_id, name')
        .eq('is_active', true)
        .order('display_order');
      if (data) setCategories(data as unknown as Category[]);
    };
    fetchCategories();
  }, []);

  // Handle Thumbnail
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Helper Upload
  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    try {
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, { type: 'image/webp' });
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

      const { error } = await supabase.storage.from('portfolio-images').upload(fileName, compressedFile);
      if (error) throw error;

      const { data } = supabase.storage.from('portfolio-images').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error('Upload err:', error);
      return null;
    }
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category_id || !thumbnailFile) {
      toast.warning('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Đang xử lý...');

    try {
      // 1. Lấy User ID
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser?.email) throw new Error('Chưa đăng nhập');
      
      const { data: userProfile } = await supabase.from('users').select('user_id').eq('email', authUser.email).single();
      const currentUserId = userProfile?.user_id;

      // 2. Upload Thumbnail
      const thumbnailUrl = await uploadImage(thumbnailFile, 'thumbnails');
      if (!thumbnailUrl) throw new Error('Lỗi upload thumbnail');

      // 3. Xử lý Upload ảnh trong các Block Content
      // Chúng ta cần biến đổi mảng `blocks` (chứa File) thành mảng JSON (chứa URL string)
      const finalContent = await Promise.all(blocks.map(async (block) => {
        if (block.type === 'imageRow' && block.images && block.images.length > 0) {
          // Upload từng ảnh trong row này
          const uploadPromises = block.images.map(file => uploadImage(file, 'gallery'));
          const imageUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
          
          return {
            type: 'imageRow',
            images: imageUrls // Lưu mảng URL
          };
        }
        // Các block text giữ nguyên
        return {
          type: block.type,
          content: block.content
        };
      }));

      // 4. Lưu vào Database
      const { error } = await supabase.from('projects').insert({
        title: formData.title,
        slug: generateSlug(formData.title),
        client_name: formData.client_name,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        is_featured: formData.is_featured,
        thumbnail_url: thumbnailUrl,
        created_by: currentUserId,
        
        // LƯU 2 TRƯỜNG MỚI DẠNG JSON
        credits: credits.filter(c => c.label && c.value), // Lọc bỏ dòng trống
        content: finalContent
      });

      if (error) throw error;

      toast.success('Thêm dự án thành công!', { id: toastId });
      router.push('/admin/projects');

    } catch (error: unknown) { // 1. Đổi any thành unknown
      console.error('Lỗi chi tiết:', error);
      
      // 2. Helper trích xuất message an toàn
      let errorMessage = 'Đã xảy ra lỗi không xác định';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Kiểm tra an toàn xem object có thuộc tính message không
        if ('message' in error) {
          errorMessage = String((error as { message: unknown }).message);
        } else if ('error_description' in error) {
          errorMessage = String((error as { error_description: unknown }).error_description);
        }
      }

      toast.error(`Lỗi: ${errorMessage}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-[var(--admin-hover)] text-[var(--admin-sub)]">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[var(--admin-fg)]">Thêm Dự án (Tạp chí)</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* --- CARD 1: THÔNG TIN CƠ BẢN --- */}
        <div className="p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-[var(--admin-fg)] border-b border-[var(--admin-border)] pb-4">Thông tin chung</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Tên Dự án *</label>
              <input required type="text" className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Khách hàng</label>
              <input type="text" className="admin-input" value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Danh mục *</label>
              <select required className="admin-input" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="flex items-center space-x-3 mt-8">
              <input type="checkbox" id="is_featured" className="w-5 h-5" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
              <label htmlFor="is_featured" className="text-sm font-medium text-[var(--admin-fg)]">Đánh dấu Nổi bật</label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--admin-fg)]">Mô tả ngắn (Intro)</label>
            <textarea rows={3} className="admin-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          {/* --- Thumbnail --- */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--admin-fg)]">Ảnh đại diện (Thumbnail) *</label>
            <div className="relative aspect-[16/9] w-full md:w-1/2 bg-[var(--admin-bg)] border-2 border-dashed border-[var(--admin-border)] rounded-lg overflow-hidden hover:border-[var(--admin-primary)] cursor-pointer group">
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" onChange={handleThumbnailChange} />
              {thumbnailPreview ? (
                <Image src={thumbnailPreview} alt="Thumb" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--admin-sub)]"><ImagePlus size={32} /><span>Chọn ảnh</span></div>
              )}
            </div>
          </div>
        </div>

        {/* --- CARD 2: CREDITS --- */}
        <div className="p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--admin-border)] pb-4">
            <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Credits (Ekip)</h2>
            <button type="button" onClick={addCredit} className="text-sm text-[var(--admin-primary)] flex items-center gap-1 hover:underline"><Plus size={16}/> Thêm dòng</button>
          </div>
          
          <div className="space-y-3">
            {credits.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <input placeholder="Vai trò (VD: Photo)" className="admin-input w-1/3" value={item.label} onChange={e => updateCredit(idx, 'label', e.target.value)} />
                <input placeholder="Tên (VD: Evis Tran)" className="admin-input w-1/3" value={item.value} onChange={e => updateCredit(idx, 'value', e.target.value)} />
                <button type="button" onClick={() => removeCredit(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* --- CARD 3: BỘ DỰNG NỘI DUNG (ARTICLE BUILDER) --- */}
        <div className="p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-[var(--admin-border)] pb-4">
            <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Nội dung chi tiết</h2>
            <div className="flex gap-2">
              <button type="button" onClick={() => addBlock('heading')} className="btn-tool"><Type size={16}/> Tiêu đề</button>
              <button type="button" onClick={() => addBlock('paragraph')} className="btn-tool"><AlignLeft size={16}/> Đoạn văn</button>
              <button type="button" onClick={() => addBlock('imageRow')} className="btn-tool"><ImagePlus size={16}/> Hàng ảnh</button>
            </div>
          </div>

          <div className="space-y-6 min-h-[200px] bg-[var(--admin-bg)] p-4 rounded-lg">
            {blocks.length === 0 && <p className="text-center text-[var(--admin-sub)] italic py-10">Chưa có nội dung. Hãy thêm các block phía trên.</p>}
            
            {blocks.map((block, index) => (
              <div key={block.id} className="relative group bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-4 shadow-sm">
                <div className="absolute -left-3 -top-3 bg-[var(--admin-fg)] text-[var(--admin-bg)] text-xs font-bold px-2 py-1 rounded shadow">
                  #{index + 1} {block.type === 'heading' ? 'Tiêu đề' : block.type === 'paragraph' ? 'Văn bản' : 'Ảnh'}
                </div>
                <button type="button" onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><X size={18}/></button>

                {/* Render Input dựa theo Type */}
                {block.type === 'heading' && (
                  <input 
                    type="text" 
                    placeholder="Nhập tiêu đề phân đoạn..." 
                    className="w-full text-xl font-bold bg-transparent border-b border-transparent focus:border-[var(--admin-primary)] outline-none p-2"
                    value={block.content}
                    onChange={e => updateBlockContent(block.id, e.target.value)}
                  />
                )}

                {block.type === 'paragraph' && (
                  <textarea 
                    rows={3} 
                    placeholder="Nhập nội dung đoạn văn..." 
                    className="w-full bg-transparent resize-y outline-none p-2 text-[var(--admin-sub)]"
                    value={block.content}
                    onChange={e => updateBlockContent(block.id, e.target.value)}
                  />
                )}

                {block.type === 'imageRow' && (
                  <div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {block.previews?.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded overflow-hidden border border-[var(--admin-border)]">
                          <Image src={src} alt="preview" fill className="object-cover" />
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-[var(--admin-border)] rounded hover:bg-[var(--admin-bg)] cursor-pointer">
                        <Upload size={20} className="text-[var(--admin-sub)]"/>
                        <span className="text-xs text-[var(--admin-sub)]">Thêm ảnh</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleBlockImagesChange(block.id, e.target.files)} />
                      </label>
                    </div>
                    <p className="text-xs text-[var(--admin-sub)]">Hệ thống sẽ tự động chia cột dựa trên số lượng ảnh (1-4 ảnh).</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-4 border-t border-[var(--admin-border)]">
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30 font-medium disabled:opacity-70">
            {isLoading ? <Loader2 className="animate-spin" /> : <Save />} Lưu Dự Án
          </button>
        </div>
      </form>

      <style jsx>{`
        .admin-input {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--admin-bg);
          border: 1px solid var(--admin-border);
          border-radius: 0.5rem;
          outline: none;
          color: var(--admin-fg);
        }
        .admin-input:focus {
          border-color: var(--admin-primary);
          box-shadow: 0 0 0 2px var(--admin-primary-20);
        }
        .btn-tool {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: var(--admin-bg);
          border: 1px solid var(--admin-border);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: var(--admin-fg);
          transition: all 0.2s;
        }
        .btn-tool:hover {
          background-color: var(--admin-hover);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
        }
      `}</style>
    </div>
  );
}

// Helper Slug
const generateSlug = (str: string) => {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') + '-' + Date.now();
};