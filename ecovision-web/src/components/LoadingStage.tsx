import React from "react";

interface LoadingStageProps {
  filename?: string;
}

export const LoadingStage: React.FC<LoadingStageProps> = ({ filename }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-64px)] bg-[#f4f5f8]">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-md space-y-6">
        {/* Spinner Circular con Colores Enteros */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-[#e5322d] animate-spin" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Analizando residuo con IA...
          </h2>
          <p className="text-sm text-slate-600">
            {filename ? (
              <span>Procesando <strong className="text-slate-800">{filename}</strong> con MobileNetV2...</span>
            ) : (
              "Extrayendo características visuales y calculando probabilidades..."
            )}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
          Por favor, espera un momento.
        </div>
      </div>
    </div>
  );
};
