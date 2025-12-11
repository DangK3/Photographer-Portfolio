'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CalendarContextType {
  date: Date;
  setDate: (date: Date) => void;
  visibleRoomIds: number[];
  setVisibleRoomIds: (ids: number[]) => void;
  toggleRoomVisibility: (roomId: number) => void;
  isCreateModalOpen: boolean;
  setCreateModalOpen: (isOpen: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [date, setDate] = useState(new Date());
  // Mặc định là mảng rỗng (sẽ được component con check và fill all nếu rỗng lần đầu)
  const [visibleRoomIds, setVisibleRoomIds] = useState<number[]>([]); 
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const toggleRoomVisibility = (roomId: number) => {
    setVisibleRoomIds(prev => {
      if (prev.includes(roomId)) {
        return prev.filter(id => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  return (
    <CalendarContext.Provider value={{
      date,
      setDate,
      visibleRoomIds,
      setVisibleRoomIds,
      toggleRoomVisibility,
      isCreateModalOpen,
      setCreateModalOpen,
    }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}