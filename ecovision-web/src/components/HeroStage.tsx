import React, { useRef } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";

interface HeroStageProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: (sampleName: string, filename: string) => void;
}

export const HeroStage: React.FC<HeroStageProps> = ({ onFileSelect, onSampleSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const samples = [
    { label: "📦 Cartón", file: "A_carton1.jpg" },
    { label: "🍾 Vidrio", file: "A_vidrio1.jpg" },
    { label: "🥫 Metal", file: "A_metal1.jpg" },
    { label: "📄 Papel", file: "A_papel1.jpg" },
    { label: "🥤 Plástico", file: "B_plastico2.jpg" },
    { label: "🗑️ Otros", file: "B_otros1.jpg" },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 md:py-16 max-w-4xl mx-auto w-full">
      {/* Inputs ocultos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Título Principal */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
        Clasificar Residuo
      </h1>

      {/* Subtítulo explicativo */}
      <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
        Identifica al instante si tu objeto es plástico, papel, cartón, vidrio o metal mediante Inteligencia Artificial y descubre la manera correcta de reciclarlo.
      </p>

      {/* Botón Principal de Acción (Estilo iLovePDF) */}
      <div className="mt-10 flex items-center justify-center gap-3 w-full max-w-md">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-[#e5322d] hover:bg-[#d32722] text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl text-lg sm:text-xl shadow-md transition-colors flex items-center justify-center gap-3 cursor-pointer select-none"
        >
          <ImageIcon className="w-6 h-6" />
          <span>Seleccionar imagen</span>
        </button>

        {/* Botón de Cámara Directa */}
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          title="Tomar foto con la cámara"
          className="p-4 sm:p-5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md transition-colors cursor-pointer"
        >
          <Camera className="w-6 h-6" />
        </button>
      </div>

      {/* Texto de Arrastrar y Soltar */}
      <p className="mt-4 text-sm text-slate-500 font-medium">
        o arrastra y suelta los documentos o fotos aquí
      </p>

      {/* Selector de Muestras Rápidas */}
      <div className="mt-12 pt-8 border-t border-slate-200 w-full max-w-2xl">
        <p className="text-xs uppercase tracking-wider font-bold text-slate-600 mb-4">
          ¿No tienes una foto a mano? Prueba con una muestra del dataset:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {samples.map((s) => (
            <button
              key={s.file}
              type="button"
              onClick={() => onSampleSelect(s.label, s.file)}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
