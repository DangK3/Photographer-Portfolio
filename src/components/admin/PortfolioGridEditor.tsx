// src/components/admin/PortfolioGridEditor.tsx
'use client';

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { toast } from 'sonner';
// Thêm GripVertical vào import
import { Save, RotateCcw, Edit3, Check, MousePointerClick, GripVertical } from 'lucide-react';
import { ProjectData } from '@/data/projects-master-data';
import { updatePortfolioLayout, ProjectGridUpdate } from '@/lib/actions';
//import { supabase } from '../../../lib/supabase';
import { createBrowserClient } from '@supabase/ssr';

// --- IMPORT DND KIT ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { SortableProjectItem } from './SortableProjectItem'; // Component vừa tạo ở B1



interface EditorProps {
  initialProjects: ProjectData[];
}

export default function PortfolioGridEditor({ initialProjects }: EditorProps) {
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [supabase] = useState(() => createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Cấu hình cảm biến kéo thả
  // activationConstraint: distance 5px -> Phải kéo 5px mới tính là drag (tránh click nhầm nút resize)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const getImageSrc = (img: string | StaticImageData) => {
    return typeof img === 'string' ? img : img.src;
  };

  // --- LOGIC XỬ LÝ KHI THẢ CHUỘT (DRAG END) ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        
        // Hàm này của dnd-kit sẽ đổi chỗ phần tử trong mảng
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Logic Resize (Giữ nguyên)
  const handleResize = (id: number, type: 'col' | 'row', delta: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      let newVal = 0;
      if (type === 'col') {
        newVal = Math.max(1, Math.min(3, (p.colSpan || 1) + delta));
        return { ...p, colSpan: newVal };
      } else {
        newVal = Math.max(1, Math.min(4, (p.rowSpan || 1) + delta));
        return { ...p, rowSpan: newVal };
      }
    }));
  };

  // Logic Lưu
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Không tìm thấy phiên đăng nhập. Vui lòng F5.');
        return;
      }      
      // Chuẩn bị dữ liệu (Bao gồm cả displayOrder mới dựa trên vị trí index)
      const updates: ProjectGridUpdate[] = projects.map((p, index) => ({
        id: p.id,
        colSpan: p.colSpan || 1,
        rowSpan: p.rowSpan || 1,
        displayOrder: index + 1 // Quan trọng: Index trong mảng state chính là thứ tự hiển thị
      }));

      const res = await updatePortfolioLayout(session.access_token, updates);

      if (res.success) {
        toast.success('Đã lưu bố cục & thứ tự thành công!');
        setIsEditing(false);
      } else {
        toast.error(`Lỗi: ${res.error}`);
      }
    } catch (err) {
      const error = err as Error;
      toast.error(`Lỗi kết nối: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Khôi phục lại ban đầu?')) setProjects(initialProjects);
  };

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="sticky top-4 z-50 bg-[var(--admin-card)] border border-[var(--admin-border)] p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEditing ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                {isEditing ? <Edit3 size={20} /> : <Check size={20} />}
            </div>
            <div>
                <h3 className="font-bold text-[var(--admin-fg)]">
                    {isEditing ? 'Chế độ Chỉnh sửa' : 'Chế độ Xem trước'}
                </h3>
                <p className="text-xs text-[var(--admin-sub)]">
                    {isEditing ? 'Kéo thả để sắp xếp. Bấm +/- để chỉnh size.' : 'Giao diện hiển thị giống hệt trang chủ.'}
                </p>
            </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-[var(--admin-primary)] text-white 
              rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2 shadow-md cursor-pointer"
            >
              <MousePointerClick size={18} /> Bắt đầu sửa
            </button>
          ) : (
            <>
              <button onClick={handleReset} className="px-3 py-2 text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] rounded-lg border border-transparent hover:border-[var(--admin-border)] cursor-pointer"><RotateCcw size={18} /></button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-[var(--admin-border)] text-[var(--admin-fg)] rounded-lg text-sm cursor-pointer">Hủy</button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-md flex items-center gap-2 cursor-pointer">
                {isSaving ? '...' : <><Save size={18} /> Lưu thay đổi</>}
              </button>
            </>
          )}
        </div>
      </div>

      {/* GRID AREA */}
      <div className="border-2 border-dashed border-[var(--admin-border)] p-4 md:p-8 rounded-2xl bg-[var(--background)] min-h-[500px]">
        
        {/* --- DND CONTEXT WRAPPER --- */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px] md:auto-rows-[400px]">
              {projects.map((project) => (
                
                // Sử dụng Component Sortable Item
                <SortableProjectItem 
                    key={project.id} 
                    id={project.id} 
                    colSpan={project.colSpan || 1} 
                    rowSpan={project.rowSpan || 1}
                >
                  <div className={`relative w-full h-full rounded-lg overflow-hidden transition-all duration-300 ${isEditing ? 'ring-2 ring-offset-2 ring-indigo-500 z-10' : 'border border-transparent'}`}>
                    
                    {/* Hình ảnh */}
                    <div className="relative w-full h-full bg-gray-200 dark:bg-gray-800">
                      {project.image ? (
                          <Image
                          src={getImageSrc(project.image)}
                          alt={project.title}
                          fill
                          className={`object-cover transition-opacity ${isEditing ? 'opacity-40 grayscale' : 'opacity-100'}`}
                          />
                      ) : (
                          <div className="flex items-center justify-center h-full text-xs text-gray-500">No Image</div>
                      )}
                    </div>

                    {/* View Mode Overlay */}
                    {!isEditing && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 pointer-events-none">
                          <h3 className="text-xl font-bold text-white line-clamp-2">{project.title}</h3>
                      </div>
                    )}

                    {/* EDIT MODE CONTROLS */}
                    {isEditing && (
                      <div className="absolute inset-0 flex flex-col">
                         {/* --- NÚT KÉO THẢ (DRAG HANDLE) --- */}
                         {/* Class cursor-grab là quan trọng để báo hiệu có thể kéo */}
                         <div className="absolute top-2 right-2 p-2 bg-white text-black rounded cursor-grab active:cursor-grabbing shadow-lg hover:bg-gray-100 z-50">
                            <GripVertical size={20} />
                         </div>

                         {/* Info Badge */}
                         <div className="absolute top-2 left-2 bg-white/90 text-black px-2 py-1 rounded text-[10px] font-mono font-bold shadow-sm border border-gray-200">
                            W:{project.colSpan || 1} | H:{project.rowSpan || 1}
                         </div>

                         {/* Resize Controls (Không bị ảnh hưởng bởi drag) */}
                         <div className="flex-1 flex items-center justify-center gap-4" onPointerDown={(e) => e.stopPropagation()}> 
                            {/* e.stopPropagation() để ngăn việc bấm nút +/- bị hiểu nhầm là bắt đầu kéo */}
                            
                            {/* Width Control */}
                            <div className="flex flex-col items-center gap-1 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                               <span className="text-[10px] font-bold text-white uppercase">Rộng</span>
                               <div className="flex gap-1">
                                  <button onClick={() => handleResize(project.id, 'col', -1)} disabled={(project.colSpan || 1) <= 1} className="w-8 h-8 bg-white text-black rounded font-bold hover:bg-indigo-50">-</button>
                                  <button onClick={() => handleResize(project.id, 'col', 1)} disabled={(project.colSpan || 1) >= 3} className="w-8 h-8 bg-white text-black rounded font-bold hover:bg-indigo-50">+</button>
                               </div>
                            </div>
                            {/* Height Control */}
                            <div className="flex flex-col items-center gap-1 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                               <span className="text-[10px] font-bold text-white uppercase">Cao</span>
                               <div className="flex gap-1">
                                  <button onClick={() => handleResize(project.id, 'row', -1)} disabled={(project.rowSpan || 1) <= 1} className="w-8 h-8 bg-white text-black rounded font-bold hover:bg-indigo-50">-</button>
                                  <button onClick={() => handleResize(project.id, 'row', 1)} disabled={(project.rowSpan || 1) >= 4} className="w-8 h-8 bg-white text-black rounded font-bold hover:bg-indigo-50">+</button>
                               </div>
                            </div>
                         </div>
                         
                         <div className="absolute bottom-2 inset-x-0 text-center text-[10px] text-white/70 font-mono pointer-events-none">
                            {project.title}
                         </div>
                      </div>
                    )}
                  </div>
                </SortableProjectItem>
              ))}
            </div>

          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}