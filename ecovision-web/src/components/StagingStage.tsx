import React from "react";
import { MobileActionBar } from "./MobileActionBar";
import { X, ShieldCheck, Cpu } from "lucide-react";

interface StagingStageProps {
  file: File;
  previewUrl: string;
  onAnalyze: () => void;
  onCancel: () => void;
}

export const StagingStage: React.FC<StagingStageProps> = ({
  file,
  previewUrl,
  onAnalyze,
  onCancel,
}) => {

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileExtension = (name: string): string => {
    const ext = name.split(".").pop();
    return ext ? ext.toUpperCase() : "IMG";
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-64px)] bg-[#f5f5f7] pb-24 lg:pb-0">
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
              className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center shadow hover:bg-[#0077ed] active:bg-[#0062c4] transition-colors cursor-pointer z-10"
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
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0071e3] text-white uppercase tracking-wider">
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

        </div>

        <p className="mt-6 sm:mt-8 text-xs text-slate-500 text-center px-4">
          Todo listo. Analicemos cómo darle una segunda vida.
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
              Tu siguiente paso hacia un mejor reciclaje
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Cpu className="w-4 h-4 text-[#0071e3]" />
                <span>Una foto, una nueva posibilidad</span>
              </div>
              <p>
                Para obtener un mejor resultado, usa una foto bien iluminada con un solo residuo.
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
            className="w-full bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white font-bold py-4 px-6 rounded-xl text-lg flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer select-none active:scale-[0.98]"
          >
            <span>Analizar residuo</span>

          </button>
        </div>
      </div>

      {/* Botón Flotante Pegajoso (Sticky) en Móvil */}
      <MobileActionBar>
        <button
          type="button"
          onClick={onAnalyze}
          className="w-full bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white font-bold py-3.5 px-6 rounded-xl text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer select-none active:scale-[0.98]"
        >
          <span>Analizar residuo</span>

        </button>
      </MobileActionBar>
    </div>
  );
};
