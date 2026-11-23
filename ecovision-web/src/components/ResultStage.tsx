import React from "react";
import { Prediction, WASTE_METADATA } from "../types";
import { ProbBars } from "./ProbBars";
import { Volume2, VolumeX, RotateCcw, AlertTriangle, CheckCircle2, Recycle } from "lucide-react";

interface ResultStageProps {
  prediction: Prediction;
  imageUrl: string;
  filename: string;
  onReset: () => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export const ResultStage: React.FC<ResultStageProps> = ({
  prediction,
  imageUrl,
  filename,
  onReset,
  onSpeak,
  onStopSpeak,
  isSpeaking,
}) => {
  const meta = WASTE_METADATA[prediction.class] || WASTE_METADATA.trash;
  const confidencePercent = (prediction.confidence * 100).toFixed(1);
  const isLowConfidence = prediction.confidence < 0.6;

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      onStopSpeak();
    } else {
      const speechText = isLowConfidence
        ? `No estoy del todo seguro, pero parece ${meta.spanishName} con un ${confidencePercent} por ciento de confianza. Recuerda: ${meta.tip}`
        : `El residuo identificado es ${meta.spanishName}, con un ${confidencePercent} por ciento de confianza. Deposítalo en el ${meta.binColor}. ${meta.tip}`;
      onSpeak(speechText);
    }
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-3.5 sm:px-4 py-6 md:py-12 pb-28 lg:pb-12 flex flex-col items-center">
      {/* Título de Confirmación Superior */}
      <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-8 w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          <span>Clasificación Completada</span>
        </div>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
          ¡El residuo ha sido analizado con éxito!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 truncate max-w-md mx-auto">
          Resultado obtenido para <strong className="text-slate-800">{filename}</strong>
        </p>
      </div>

      {/* Botón Principal de Acción Destacada (Escuchar Audio) */}
      <div className="mb-6 sm:mb-8 w-full max-w-md">
        <button
          type="button"
          onClick={handleToggleSpeak}
          className={`w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg text-white shadow-md transition-all flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer select-none active:scale-[0.98] ${
            isSpeaking ? "bg-slate-800 hover:bg-slate-900" : "bg-[#e5322d] hover:bg-[#d32722] active:bg-[#cb201b]"
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Detener reproducción</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Escuchar recomendación de voz</span>
            </>
          )}
        </button>
      </div>

      {/* Cuadrícula de Resultados y Recomendaciones */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Columna Izquierda: Imagen y Clasificación Principal */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Imagen del Residuo */}
            <div className="relative w-full h-56 sm:h-72 bg-slate-100 flex items-center justify-center border-b border-slate-200">
              <img
                src={imageUrl}
                alt={meta.spanishName}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2.5 right-2.5 bg-white/95 px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 border border-slate-200 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{confidencePercent}% confianza</span>
              </div>
            </div>

            {/* Resultado Principal */}
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-600">
                    Material Identificado
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                    <span className="text-2xl sm:text-3xl">{meta.icon}</span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {meta.spanishName}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] sm:text-xs font-medium text-slate-500">Clase del modelo:</span>
                  <p className="font-mono text-xs font-bold text-slate-800">{prediction.class}</p>
                </div>
              </div>

              {/* Advertencia de baja confianza si corresponde */}
              {isLowConfidence && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Confianza moderada (&lt;60%):</strong> La imagen podría contener varios objetos. Verifica las recomendaciones antes de depositar.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta de Contenedor Ecológico */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Recycle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                ¿Dónde debes depositarlo?
              </h3>
            </div>

            <div className={`p-3.5 sm:p-4 rounded-lg ${meta.binBg} ${meta.binText} border ${meta.binBorder} font-bold flex items-center gap-3`}>
              <span className="text-xl sm:text-2xl">♻️</span>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold opacity-90">
                  Contenedor Asignado
                </p>
                <p className="text-base sm:text-lg font-black">{meta.binColor}</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1">
              <p className="font-bold text-slate-800">Instrucciones de preparación:</p>
              <p className="leading-relaxed">{meta.tip}</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Probabilidades y Acciones (En escritorio) */}
        <div className="lg:col-span-6 space-y-4">
          <ProbBars
            probabilities={prediction.probabilities}
            predictedClass={prediction.class}
          />

          {/* Botón para Clasificar Otro Residuo en Escritorio */}
          <div className="hidden lg:block bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <button
              type="button"
              onClick={onReset}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clasificar otro residuo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Botón Flotante Pegajoso (Sticky) en Móvil: no requiere scroll */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-3.5 border-t border-slate-200 z-30 shadow-lg flex gap-2.5">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 py-3.5 px-4 bg-slate-900 active:bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clasificar otro residuo</span>
        </button>

        <button
          type="button"
          onClick={handleToggleSpeak}
          title={isSpeaking ? "Detener voz" : "Escuchar recomendación"}
          className={`px-4 py-3.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center cursor-pointer active:scale-[0.98] ${
            isSpeaking ? "bg-slate-700 active:bg-slate-800" : "bg-[#e5322d] active:bg-[#cb201b]"
          }`}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
