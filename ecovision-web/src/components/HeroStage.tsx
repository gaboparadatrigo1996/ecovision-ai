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
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 sm:py-16 max-w-4xl mx-auto w-full">
      {/* Inputs ocultos de archivo y cámara */}
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
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
        Clasificar Residuo
      </h1>

      {/* Subtítulo explicativo */}
      <p className="mt-2.5 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
        Identifica al instante si tu objeto es plástico, papel, cartón, vidrio o metal mediante Inteligencia Artificial y descubre cómo reciclarlo.
      </p>

      {/* Botones Principales de Acción para móvil y escritorio */}
      <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2.5 sm:gap-3 w-full max-w-md">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 h-14 sm:h-16 bg-[#e5322d] hover:bg-[#d32722] active:bg-[#cb201b] text-white font-bold px-4 sm:px-8 rounded-xl text-base sm:text-xl shadow-md transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer select-none active:scale-[0.98]"
        >
          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span>Seleccionar imagen</span>
        </button>

        {/* Botón de Cámara Móvil */}
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          title="Tomar foto con la cámara"
          className="w-14 sm:w-16 h-14 sm:h-16 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-[0.98]"
        >
          <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Texto de Arrastrar y Soltar */}
      <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-500 font-medium">
        o arrastra y suelta tu foto aquí
      </p>

      {/* Selector de Muestras Rápidas adaptado a cuadrícula en celular */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 w-full max-w-2xl">
        <p className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-slate-600 mb-3 sm:mb-4">
          ¿No tienes una foto a mano? Prueba con una muestra:
        </p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 w-full">
          {samples.map((s) => (
            <button
              key={s.file}
              type="button"
              onClick={() => onSampleSelect(s.label, s.file)}
              className="py-2.5 px-3 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg text-xs sm:text-xs font-semibold shadow-sm transition-all cursor-pointer text-center active:scale-[0.98]"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
