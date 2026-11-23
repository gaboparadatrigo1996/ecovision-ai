import React, { useState, useRef } from "react";
import { Upload, Camera, Image as ImageIcon, Sparkles } from "lucide-react";

interface UploaderProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onFileSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileSelected(file);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Zona de Drag & Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-200 ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 hover:border-emerald-500/70 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20"
        } ${isLoading ? "opacity-50 pointer-events-none" : "shadow-sm hover:shadow-md"}`}
        role="button"
        tabIndex={0}
        aria-label="Arrastra una imagen de un residuo o haz clic para subir"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <Upload className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Arrastra una foto o haz clic para explorar
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Formatos admitidos: JPG, PNG o WEBP (hasta 10 MB)
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción rápida: Cámara y Galería */}
      <div className="grid grid-cols-2 gap-3">
        {/* Disparador de Cámara Móvil */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
          <span>Usar cámara</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Elegir archivo</span>
        </button>
      </div>

      {/* Recomendación de captura */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400">
        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong>Consejo para mayor precisión:</strong> Fotografía un solo objeto con buena iluminación y de preferencia sobre un fondo limpio o claro.
        </p>
      </div>
    </div>
  );
};
