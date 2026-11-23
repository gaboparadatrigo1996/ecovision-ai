import React, { useRef } from "react";
import { X, Plus, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

interface StagingStageProps {
  file: File;
  previewUrl: string;
  onAnalyze: () => void;
  onCancel: () => void;
  onChangeFile: (file: File) => void;
}

export const StagingStage: React.FC<StagingStageProps> = ({
  file,
  previewUrl,
  onAnalyze,
  onCancel,
  onChangeFile,
}) => {
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileExtension = (name: string): string => {
    const ext = name.split(".").pop();
    return ext ? ext.toUpperCase() : "IMG";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChangeFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-64px)] bg-[#f4f5f8] pb-24 lg:pb-0">
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Área Principal de Trabajo (Canvas con el archivo en cola) */}
      <div className="flex-1 p-4 sm:p-8 md:p-12 flex flex-col items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* Tarjeta de previsualización estilo iLovePDF */}
          <div className="relative w-64 sm:w-56 bg-white rounded-xl border border-slate-300 shadow-md p-3 flex flex-col group transition-transform">
            {/* Botón Eliminar / Cerrar */}
            <button
              type="button"
              onClick={onCancel}
              title="Quitar archivo"
              className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-[#e5322d] text-white flex items-center justify-center shadow hover:bg-[#d32722] active:bg-[#cb201b] transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Thumbnail de la imagen */}
            <div className="w-full h-56 sm:h-64 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
              <img
                src={previewUrl}
                alt={file.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Metadatos del archivo */}
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#e5322d] text-white uppercase tracking-wider">
                {getFileExtension(file.name)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          </div>

          {/* Botón flotante para cambiar imagen */}
          <button
            type="button"
            onClick={() => replaceInputRef.current?.click()}
            title="Cambiar imagen"
            className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border-2 border-dashed border-slate-300 flex items-center justify-center shadow-sm transition-all hover:border-slate-500 cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <p className="mt-6 sm:mt-8 text-xs text-slate-500 text-center px-4">
          Presiona <strong>Analizar residuo</strong> para procesar la imagen con el modelo.
        </p>
      </div>

      {/* Panel Lateral de Opciones (en escritorio al costado, en móvil debajo) */}
      <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-sm">
        <div className="space-y-4 sm:space-y-6">
          <div className="border-b border-slate-200 pb-3 sm:pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Clasificar Residuo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configuración de análisis con Deep Learning
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Cpu className="w-4 h-4 text-[#e5322d]" />
                <span>Modelo de Red Neuronal</span>
              </div>
              <p>
                MobileNetV2 fine-tuned en Stanford TrashNet (Exactitud: 88.65%).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Resultados Disponibles</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px] sm:text-xs">
                <li>Clasificación de material con % confianza</li>
                <li>Identificación del contenedor ecológico</li>
                <li>Consejos prácticos de preparación</li>
                <li>Lectura de voz alta por audio</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botón Principal (En escritorio fijo en el panel, en móvil abajo) */}
        <div className="hidden lg:block pt-6 border-t border-slate-200 mt-6">
          <button
            type="button"
            onClick={onAnalyze}
            className="w-full bg-[#e5322d] hover:bg-[#d32722] active:bg-[#cb201b] text-white font-bold py-4 px-6 rounded-xl text-lg flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer select-none active:scale-[0.98]"
          >
            <span>Analizar residuo</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Botón Flotante Pegajoso (Sticky) en Móvil */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-3.5 border-t border-slate-200 z-30 shadow-lg">
        <button
          type="button"
          onClick={onAnalyze}
          className="w-full bg-[#e5322d] hover:bg-[#d32722] active:bg-[#cb201b] text-white font-bold py-3.5 px-6 rounded-xl text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer select-none active:scale-[0.98]"
        >
          <span>Analizar residuo</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
