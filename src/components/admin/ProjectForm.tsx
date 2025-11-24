// src/components/admin/ProjectForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// 1. THAY ĐỔI QUAN TRỌNG: Dùng createBrowserClient thay vì client cũ
import { createBrowserClient } from '@supabase/ssr'; 
import { compressImage } from '@/lib/image-utils';
import { toast } from 'sonner';
import { 
  ArrowLeft, Upload, X, Save, Loader2, ImagePlus, Plus, Type, AlignLeft, Trash2 
} from 'lucide-react';

// --- 1. ĐỊNH NGHĨA TYPES ---

export type FormMode = 'create' | 'edit';

interface Category {
  category_id: number;
  name: string;
}

interface CreditItem {
  label: string;
  value: string;
}

export interface BlockDB {
  type: 'heading' | 'paragraph' | 'imageRow';
  content?: string;
  images?: string[]; 
}

interface ContentBlockState {
  id: string;
  type: 'heading' | 'paragraph' | 'imageRow';
  content: string;
  existingImages: string[]; 
  newFiles: File[];         
  previews: string[];       
}

export interface ProjectInitialData {
  id?: number;
  title: string;
  client_name: string;
  description: string;
  category_id: string; 
  is_featured: boolean;
  thumbnail_url: string;
  credits: CreditItem[];
  content: BlockDB[];
}

interface ProjectFormProps {
  mode: FormMode;
  initialData?: ProjectInitialData;
}

// --- 2. COMPONENT CHÍNH ---

export default function ProjectForm({ mode, initialData }: ProjectFormProps) {
  // 2. KHỞI TẠO CLIENT SUPABASE CÓ COOKIE (Để Upload được)
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // State Form
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    description: '',
    category_id: '',
    is_featured: false,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [credits, setCredits] = useState<CreditItem[]>([{ label: 'Location', value: 'Oni Studio' }]);
  const [blocks, setBlocks] = useState<ContentBlockState[]>([]);

  // --- 3. KHỞI TẠO DỮ LIỆU ---
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

    if (mode === 'edit' && initialData) {
      setFormData({
        title: initialData.title || '',
        client_name: initialData.client_name || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        is_featured: initialData.is_featured || false,
      });

      if (initialData.thumbnail_url) {
        setThumbnailPreview(initialData.thumbnail_url);
      }

      if (initialData.credits?.length > 0) {
        setCredits(initialData.credits);
      }

      if (initialData.content?.length > 0) {
        const mappedBlocks: ContentBlockState[] = initialData.content.map((b) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: b.type,
          content: b.content || '',
          existingImages: b.images || [],
          newFiles: [],
          previews: []
        }));
        setBlocks(mappedBlocks);
      }
    }
  }, [mode, initialData, supabase]);

  // --- 4. HELPER FUNCTIONS ---

  const addCredit = () => setCredits([...credits, { label: '', value: '' }]);
  const removeCredit = (index: number) => setCredits(credits.filter((_, i) => i !== index));
  const updateCredit = (index: number, field: keyof CreditItem, value: string) => {
    const newCredits = [...credits];
    newCredits[index][field] = value;
    setCredits(newCredits);
  };

  const addBlock = (type: ContentBlockState['type']) => {
    setBlocks([
      ...blocks, 
      { id: Math.random().toString(36).substr(2, 9), type, content: '', existingImages: [], newFiles: [], previews: [] }
    ]);
  };
  
  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));
  
  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const handleBlockImagesChange = (id: string, files: FileList | null) => {
    if (!files) return;
    const newFilesList = Array.from(files);
    const newPreviewsList = newFilesList.map(f => URL.createObjectURL(f));

    setBlocks(blocks.map(b => {
      if (b.id === id) {
        return {
          ...b,
          newFiles: [...b.newFiles, ...newFilesList],
          previews: [...b.previews, ...newPreviewsList]
        };
      }
      return b;
    }));
  };

  const removeImageFromBlock = (blockId: string, imgIndex: number, isExisting: boolean) => {
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;

      if (isExisting) {
        return { ...b, existingImages: b.existingImages.filter((_, i) => i !== imgIndex) };
      } else {
        const updatedFiles = b.newFiles.filter((_, i) => i !== imgIndex);
        const updatedPreviews = b.previews.filter((_, i) => i !== imgIndex);
        return { ...b, newFiles: updatedFiles, previews: updatedPreviews };
      }
    }));
  };

  // HÀM UPLOAD (Giờ sẽ hoạt động vì client 'supabase' đã có Auth Token)
  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    try {
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, { type: 'image/webp' });
      // Thêm timestamp để tránh trùng tên
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

  const generateSlug = (str: string) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') + '-' + Date.now();
  };

  // --- 5. SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category_id || (!thumbnailFile && !thumbnailPreview)) {
      toast.warning('Vui lòng điền tên, danh mục và ảnh đại diện.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Đang xử lý dữ liệu...');

    try {
      // A. Upload Thumbnail
      let finalThumbnailUrl = thumbnailPreview; 
      if (thumbnailFile) {
        const url = await uploadImage(thumbnailFile, 'thumbnails');
        if (!url) throw new Error('Lỗi upload thumbnail');
        finalThumbnailUrl = url;
      }

      // B. Xử lý Content Blocks
      const finalContent = await Promise.all(blocks.map(async (block) => {
        let imageUrls: string[] = [...block.existingImages];

        if (block.type === 'imageRow' && block.newFiles.length > 0) {
          const uploadPromises = block.newFiles.map(file => uploadImage(file, 'gallery'));
          const newUrls = (await Promise.all(uploadPromises)).filter((url): url is string => url !== null);
          imageUrls = [...imageUrls, ...newUrls];
        }

        return {
          type: block.type,
          content: block.content,
          images: imageUrls.length > 0 ? imageUrls : undefined
        };
      }));

      // C. Chuẩn bị Payload
      const payload = {
        title: formData.title,
        client_name: formData.client_name,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        is_featured: formData.is_featured,
        thumbnail_url: finalThumbnailUrl,
        credits: credits.filter(c => c.label && c.value), 
        content: finalContent,
        updated_at: new Date().toISOString(),
        ...(mode === 'create' ? { slug: generateSlug(formData.title) } : {}),
      };

      // D. Insert/Update
      if (mode === 'create') {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('users').select('user_id').eq('auth_id', user?.id).single();
        
        const { data, error } = await supabase
          .from('projects')
          .insert({ ...payload, created_by: profile?.user_id })
          .select('project_id')
          .single();
          
        if (error) throw error;
        toast.success('Tạo dự án mới thành công!', { id: toastId });
        
        if (data) router.push(`/admin/projects/${data.project_id}`);

      } else {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('project_id', initialData?.id);
          
        if (error) throw error;
        toast.success('Cập nhật dự án thành công!', { id: toastId });
        router.refresh();
      }

    } catch (error: unknown) {
      let msg = 'Lỗi không xác định';
      if (error instanceof Error) msg = error.message;
      console.error(error);
      toast.error(`Lỗi: ${msg}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI RENDER ---
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => router.push('/admin/projects')} className="p-2 rounded-lg hover:bg-[var(--admin-hover)] text-[var(--admin-sub)] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-[var(--admin-fg)]">
            {mode === 'create' ? 'Thêm Dự án Mới' : 'Chỉnh sửa Dự án'}
            </h1>
            {mode === 'edit' && <p className="text-xs text-[var(--admin-sub)]">ID: {initialData?.id}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* INFO CARD */}
        <div className="p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-[var(--admin-fg)] border-b border-[var(--admin-border)] pb-4">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Tên Dự án <span className="text-red-500">*</span></label>
              <input required type="text" className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="VD: Lookbook Summer 2024"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Khách hàng</label>
              <input type="text" className="admin-input" value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} placeholder="VD: Vogue Vietnam"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Danh mục <span className="text-red-500">*</span></label>
              <select required className="admin-input" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="flex items-center space-x-3 mt-8">
              <input type="checkbox" id="is_featured" className="w-5 h-5 accent-[var(--admin-primary)]" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
              <label htmlFor="is_featured" className="text-sm font-medium text-[var(--admin-fg)] cursor-pointer">Đánh dấu là <strong>Nổi bật</strong></label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--admin-fg)]">Mô tả ngắn</label>
            <textarea rows={3} className="admin-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Giới thiệu sơ lược về dự án..."/>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--admin-fg)]">Ảnh đại diện (Thumbnail) <span className="text-red-500">*</span></label>
            <div className="relative aspect-video w-full md:w-1/2 bg-[var(--admin-bg)] border-2 border-dashed border-[var(--admin-border)] rounded-lg overflow-hidden group hover:border-[var(--admin-primary)] transition-colors">
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" onChange={(e) => {
                 if(e.target.files?.[0]) {
                    setThumbnailFile(e.target.files[0]);
                    setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
                 }
              }} />
              {thumbnailPreview ? (
                <>
                    <Image src={thumbnailPreview} alt="Thumb" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium flex items-center gap-2"><Upload size={16}/> Thay ảnh khác</p>
                    </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--admin-sub)] group-hover:text-[var(--admin-primary)] transition-colors">
                    <ImagePlus size={32} className="mb-2" />
                    <span className="text-sm">Bấm để chọn ảnh</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CREDITS CARD */}
        <div className="p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--admin-border)] pb-4">
            <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Credits</h2>
            <button type="button" onClick={addCredit} className="text-sm text-[var(--admin-primary)] hover:bg-[var(--admin-hover)] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                <Plus size={16}/> Thêm dòng
            </button>
          </div>
          <div className="space-y-3">
            {credits.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input placeholder="Vai trò (VD: Photo)" className="admin-input w-1/3" value={item.label} onChange={e => updateCredit(idx, 'label', e.target.value)} />
                <input placeholder="Tên (VD: Dang Tran)" className="admin-input w-1/2" value={item.value} onChange={e => updateCredit(idx, 'value', e.target.value)} />
                <button type="button" onClick={() => removeCredit(idx)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT BUILDER */}
        <div className="p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[var(--admin-border)] pb-4 gap-4">
            <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Nội dung bài viết</h2>
            <div className="flex gap-2">
              <button type="button" onClick={() => addBlock('heading')} className="btn-tool"><Type size={16}/> Tiêu đề</button>
              <button type="button" onClick={() => addBlock('paragraph')} className="btn-tool"><AlignLeft size={16}/> Đoạn văn</button>
              <button type="button" onClick={() => addBlock('imageRow')} className="btn-tool"><ImagePlus size={16}/> Hàng ảnh</button>
            </div>
          </div>

          <div className="space-y-6 min-h-[200px] bg-[var(--admin-bg)] p-4 rounded-lg border border-[var(--admin-border)]">
             {blocks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-[var(--admin-sub)] opacity-60">
                    <AlignLeft size={48} className="mb-2" />
                    <p>Chưa có nội dung.</p>
                </div>
             )}
             
             {blocks.map((block, index) => (
               <div key={block.id} className="relative group bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
                 <div className="absolute -left-3 -top-3 bg-[var(--admin-fg)] text-[var(--admin-bg)] text-[10px] font-bold px-2 py-1 rounded shadow uppercase tracking-wider">
                   {index + 1}. {block.type}
                 </div>
                 
                 <button type="button" onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 text-[var(--admin-sub)] hover:text-red-500 hover:bg-[var(--admin-bg)] p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <X size={18}/>
                 </button>

                 <div className="mt-2">
                    {block.type === 'heading' && (
                        <input type="text" placeholder="Nhập tiêu đề section..." className="w-full text-xl font-bold bg-transparent border-b border-[var(--admin-border)] focus:border-[var(--admin-primary)] outline-none pb-2 text-[var(--admin-fg)]" value={block.content} onChange={e => updateBlockContent(block.id, e.target.value)} />
                    )}
                    
                    {block.type === 'paragraph' && (
                        <textarea rows={4} placeholder="Nhập nội dung đoạn văn..." className="w-full bg-[var(--admin-bg)] rounded p-3 resize-y outline-none text-[var(--admin-fg)] border border-transparent focus:border-[var(--admin-border)] transition-colors" value={block.content} onChange={e => updateBlockContent(block.id, e.target.value)} />
                    )}
                    
                    {block.type === 'imageRow' && (
                    <div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {/* ẢNH CŨ */}
                            {block.existingImages.map((src, i) => (
                                <div key={`exist-${i}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-500/50 group/img">
                                    <Image src={src} alt="exist" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors" />
                                    <button type="button" onClick={() => removeImageFromBlock(block.id, i, true)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-sm">
                                        <X size={12}/>
                                    </button>
                                </div>
                            ))}
                            {/* ẢNH MỚI */}
                            {block.previews.map((src, i) => (
                                <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-500/50 group/img">
                                    <Image src={src} alt="new" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors" />
                                    <button type="button" onClick={() => removeImageFromBlock(block.id, i, false)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-sm">
                                        <X size={12}/>
                                    </button>
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-[var(--admin-border)] rounded-lg hover:bg-[var(--admin-hover)] hover:border-[var(--admin-primary)] cursor-pointer transition-all text-[var(--admin-sub)] hover:text-[var(--admin-primary)]">
                                <Upload size={24} className="mb-1"/>
                                <span className="text-xs font-medium">Thêm ảnh</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleBlockImagesChange(block.id, e.target.files)} />
                            </label>
                        </div>
                    </div>
                    )}
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-[var(--admin-border)] sticky bottom-0 bg-[var(--admin-bg)] py-4 z-20">
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 shadow-lg shadow-indigo-500/30 font-medium disabled:opacity-70 transition-all transform hover:-translate-y-0.5">
            {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20}/>} 
            {mode === 'create' ? 'Lưu & Tạo mới' : 'Cập nhật thay đổi'}
          </button>
        </div>
      </form>

      <style jsx global>{`
        .admin-input { width: 100%; padding: 0.75rem; background-color: var(--admin-bg); border: 1px solid var(--admin-border); border-radius: 0.5rem; outline: none; color: var(--admin-fg); transition: all 0.2s; }
        .admin-input:focus { border-color: var(--admin-primary); ring: 2px solid var(--admin-primary); }
        .btn-tool { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: var(--admin-bg); border: 1px solid var(--admin-border); border-radius: 0.5rem; font-size: 0.875rem; color: var(--admin-fg); transition: all 0.2s; font-weight: 500; }
        .btn-tool:hover { background-color: var(--admin-hover); border-color: var(--admin-primary); color: var(--admin-primary); transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
}