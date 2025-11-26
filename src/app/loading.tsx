// src/app/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--foreground)]" />
        <p className="text-sm text-[var(--sub-text)] font-medium tracking-widest uppercase animate-pulse">
          Loading Oni Studio...
        </p>
      </div>
    </div>
  );
}