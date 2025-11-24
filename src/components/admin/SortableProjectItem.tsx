// src/components/admin/SortableProjectItem.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: number;
  children: React.ReactNode;
  colSpan: number; // Cần nhận vào để set style grid
  rowSpan: number;
}

export function SortableProjectItem({ id, children, colSpan, rowSpan }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
    zIndex: isDragging ? 50 : 'auto', // Khi kéo thì nổi lên trên
    opacity: isDragging ? 0.5 : 1,    // Khi kéo thì mờ đi chút
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full relative group">
      {children}
    </div>
  );
}