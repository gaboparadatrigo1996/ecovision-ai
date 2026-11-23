import React from "react";
import { Prediction, WASTE_METADATA } from "../types";
import { ProbBars } from "./ProbBars";
import { Volume2, VolumeX, RotateCcw, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ResultCardProps {
  prediction: Prediction;
  imageUrl: string;
  onReset: () => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  prediction,
  imageUrl,
  onReset,
  onSpeak,
  onStopSpeak,
  isSpeaking
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
        : `El residuo identificado es ${meta.spanishName}, con un ${confidencePercent} por ciento de confianza. Deposítalo en el contenedor ${meta.binColor}. ${meta.tip}`;
      onSpeak(speechText);
    }
  };

  return (
    <div
      className="w-full max-w-xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300"
      aria-live="polite"
    >
      {/* Encabezado con imagen e indicador */}
      <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
        <img
          src={imageUrl}
          alt={`Residuo clasificado como ${meta.spanishName}`}
          className="w-full h-full object-contain"
        />

        {/* Badge de confianza flotante */}
        <div className="absolute top-3 right-3 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 py-1.5 px-3 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 border border-white/20">
          {isLowConfidence ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-700 dark:text-amber-400">
                {confidencePercent}% (Baja)
              </span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400">
                {confidencePercent}% Confianza
              </span>
            </>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Aviso de baja confianza (< 60%) */}
        {isLowConfidence && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Confianza baja (&lt; 60%)</p>
              <p>
                El modelo no está completamente seguro del material. Esto suele ocurrir cuando hay varios objetos o el fondo tiene patrones complejos. Te recomendamos verificar manualmente.
              </p>
            </div>
          </div>
        )}

        {/* Resultado Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Categoría Detectada
            </span>
            <div className="flex items-center gap-3">
              <span className="text-4xl" role="img" aria-label={meta.spanishName}>
                {meta.icon}
              </span>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize">
                  {meta.spanishName}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Clase original: <code className="text-xs">{prediction.class}</code>
                </p>
              </div>
            </div>
          </div>

          {/* Contenedor sugerido */}
          <div className="flex flex-col sm:items-end">
            <span className="text-xs text-slate-500 dark:text-slate-400">Contenedor</span>
            <span className="inline-block mt-0.5 py-1 px-3 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              {meta.binColor}
            </span>
          </div>
        </div>

        {/* Guía de Reciclaje */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>¿Cómo reciclar este residuo?</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {meta.tip}
          </p>
        </div>

        {/* Barras de Probabilidades Top-3 */}
        <ProbBars
          probabilities={prediction.probabilities}
          predictedClass={prediction.class}
        />

        {/* Botones de acción */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleToggleSpeak}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all shadow-sm ${
              isSpeaking
                ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98]"
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Detener voz</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Escuchar en voz alta</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clasificar otro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
