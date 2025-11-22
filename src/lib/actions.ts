// src/lib/actions.ts
import { supabase } from '../../lib/supabase';
import { PROJECTS_MASTER_DATA, ProjectData, ArticleBlock } from '@/data/projects-master-data';

// 1. Định nghĩa Interface CHÍNH XÁC khớp với Database
interface ProjectRow {
  project_id: number;
  title: string;
  client_name: string | null;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  slug: string;
  col_span: number | null;
  row_span: number | null;
  is_featured: boolean;
  
  // QUAN TRỌNG: Cột chứa nội dung bài viết
  content: ArticleBlock[] | null; 
  credits: { label: string; value: string }[] | null;

  // Join bảng categories
  portfolio_categories: {
    name: string;
    slug: string;
  } | null;
  
  // Join bảng ảnh cũ (Fallback)
  project_images: {
    image_url: string;
    display_order: number;
  }[];
}

export async function getProjects(categorySlug?: string): Promise<ProjectData[]> {
  try {
    // --- CHECK DEMO MODE ---
    const { data: setting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'is_demo_mode')
      .single();

    const isDemo = setting?.value === 'true';

    if (isDemo) {
      let data = PROJECTS_MASTER_DATA;
      if (categorySlug && categorySlug !== 'all') {
        data = data.filter(p => p.category === categorySlug);
      }
      return data;
    }

    // --- FETCH DATA TỪ SUPABASE ---
    let query = supabase
      .from('projects')
      .select(`
        *,
        portfolio_categories!inner ( name, slug ),
        project_images ( image_url, display_order )
      `)
      .order('display_order', { ascending: true }) 
      .order('created_at', { ascending: false });

    if (categorySlug && categorySlug !== 'all') {
      query = query.eq('portfolio_categories.slug', categorySlug);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Lỗi Supabase:', error);
      return [];
    }

    const projectsRaw = data as unknown as ProjectRow[];

    // 3. Map dữ liệu
    return projectsRaw.map((p) => {
      
      // A. Xử lý nội dung bài viết (Article Body)
      let articleBody: ArticleBlock[] = [];

      // Ưu tiên 1: Lấy từ cột 'content' (Dự án mới tạo bằng Admin Builder)
      if (p.content && Array.isArray(p.content) && p.content.length > 0) {
        articleBody = p.content;
      } 
      // Ưu tiên 2: Fallback cho dự án cũ (Tự tạo từ bảng project_images)
      else {
        const galleryImages = p.project_images
          ?.sort((a, b) => a.display_order - b.display_order)
          .map(img => img.image_url) || [];

        if (galleryImages.length > 0) {
          // Gom ảnh thành các row (mỗi row 2-3 ảnh tùy logic, ở đây để đơn giản là 1 row chứa hết)
          articleBody.push({
            type: 'imageRow',
            images: galleryImages
          });
        } else if (p.description) {
           // Nếu không có ảnh, ít nhất hiện mô tả
           articleBody.push({
             type: 'paragraph',
             content: p.description
           });
        }
      }

      // B. Trả về ProjectData chuẩn
      return {
        id: p.project_id,
        title: p.title,
        client_name: p.client_name || '',
        description: p.description || '',
        category: p.portfolio_categories?.slug || 'uncategorized',
        categoryName: p.portfolio_categories?.name || 'Chưa phân loại',
        image: p.thumbnail_url || '', 
        year: new Date(p.created_at).getFullYear().toString(),
        slug: p.slug,
        colSpan: p.col_span || 1,
        rowSpan: p.row_span || 1,
        isFeatured: p.is_featured || false,
        
        credits: p.credits || [],
        articleBody: articleBody, 
      };
    });

  } catch (error) {
    console.error('Lỗi không xác định khi lấy dự án:', error);
    return [];
  }
}