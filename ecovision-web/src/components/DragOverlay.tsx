import React from "react";
import { UploadCloud } from "lucide-react";

interface DragOverlayProps {
  isVisible: boolean;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-6 pointer-events-none transition-opacity duration-200">
      <div className="w-full max-w-xl border-2 border-dashed border-white rounded-2xl p-12 text-center text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
          <UploadCloud className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Suelta los archivos aquí
        </h2>
        <p className="text-sm text-slate-200">
          Imágenes JPG, PNG o WEBP de hasta 10 MB
        </p>
      </div>
    </div>
  );
};
