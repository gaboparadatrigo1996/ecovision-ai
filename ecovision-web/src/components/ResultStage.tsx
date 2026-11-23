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
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
      {/* Título de Confirmación Superior (Estilo iLovePDF) */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Clasificación Completada</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          ¡El residuo ha sido analizado con éxito!
        </h1>
        <p className="text-sm text-slate-600">
          Resultado obtenido para <strong className="text-slate-800">{filename}</strong>
        </p>
      </div>

      {/* Botón Principal de Acción Destacada (Estilo iLovePDF Descargar / Escuchar) */}
      <div className="mb-8 w-full max-w-md">
        <button
          type="button"
          onClick={handleToggleSpeak}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-md transition-colors flex items-center justify-center gap-3 cursor-pointer select-none ${
            isSpeaking ? "bg-slate-800 hover:bg-slate-900" : "bg-[#e5322d] hover:bg-[#d32722]"
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-6 h-6" />
              <span>Detener reproducción</span>
            </>
          ) : (
            <>
              <Volume2 className="w-6 h-6" />
              <span>Escuchar recomendación de voz</span>
            </>
          )}
        </button>
      </div>

      {/* Cuadrícula de Resultados y Recomendaciones */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Imagen y Clasificación Principal */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Imagen del Residuo */}
            <div className="relative w-full h-72 bg-slate-100 flex items-center justify-center border-b border-slate-200">
              <img
                src={imageUrl}
                alt={meta.spanishName}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-md text-xs font-bold text-slate-800 border border-slate-200 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{confidencePercent}% confianza</span>
              </div>
            </div>

            {/* Resultado Principal */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-600">
                    Material Identificado
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl">{meta.icon}</span>
                    <h2 className="text-2xl font-black text-slate-900">
                      {meta.spanishName}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-medium text-slate-600">Clase del modelo:</span>
                  <p className="font-mono text-xs font-bold text-slate-800">{prediction.class}</p>
                </div>
              </div>

              {/* Advertencia de baja confianza si corresponde */}
              {isLowConfidence && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Confianza moderada (&lt;60%):</strong> La imagen podría contener varios objetos o iluminación tenue. Verifica las recomendaciones antes de depositar.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta de Contenedor Ecológico */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Recycle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                ¿Dónde debes depositarlo?
              </h3>
            </div>

            <div className={`p-4 rounded-lg ${meta.binBg} ${meta.binText} border ${meta.binBorder} font-bold text-base flex items-center gap-3`}>
              <span className="text-2xl">♻️</span>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold opacity-90">
                  Contenedor Asignado
                </p>
                <p className="text-lg font-extrabold">{meta.binColor}</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1">
              <p className="font-bold text-slate-800">Instrucciones de preparación:</p>
              <p className="leading-relaxed">{meta.tip}</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Probabilidades y Acciones Secundarias */}
        <div className="lg:col-span-6 space-y-4">
          <ProbBars
            probabilities={prediction.probabilities}
            predictedClass={prediction.class}
          />

          {/* Información y Acciones Secundarias */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Próximos pasos
            </h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onReset}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clasificar otro residuo</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              EcoVision AI utiliza MobileNetV2 para clasificar 6 tipos de residuos según el dataset Stanford TrashNet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
