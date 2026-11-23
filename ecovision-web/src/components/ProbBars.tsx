import React, { useState } from "react";
import { Prediction, WASTE_METADATA, WasteClass } from "../types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProbBarsProps {
  probabilities: Prediction["probabilities"];
  predictedClass: WasteClass;
}

export const ProbBars: React.FC<ProbBarsProps> = ({ probabilities, predictedClass }) => {
  const [showAll, setShowAll] = useState(true);

  // Ordenar probabilidades de mayor a menor
  const sorted = Object.entries(probabilities)
    .map(([key, val]) => ({
      cls: key as WasteClass,
      prob: val,
      meta: WASTE_METADATA[key as WasteClass]
    }))
    .sort((a, b) => b.prob - a.prob);

  const displayed = showAll ? sorted : sorted.slice(0, 3);

  return (
    <div className="w-full space-y-3 bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Distribución de probabilidades ({displayed.length} clases)
        </h4>
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          {showAll ? (
            <>
              Mostrar menos <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Mostrar todas <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      <div className="space-y-3 pt-1">
        {displayed.map(({ cls, prob, meta }) => {
          const isTop = cls === predictedClass;
          const percentage = (prob * 100).toFixed(1);

          return (
            <div key={cls} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 font-medium text-slate-800">
                  <span className="text-base">{meta.icon}</span>
                  <span className={isTop ? "font-bold text-slate-950" : ""}>
                    {meta.spanishName}
                  </span>
                  {isTop && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                      Detectado
                    </span>
                  )}
                </span>
                <span className={`font-mono font-semibold ${isTop ? "text-slate-950" : "text-slate-500"}`}>
                  {percentage}%
                </span>
              </div>

              {/* Barra de progreso de color entero */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isTop ? "bg-[#e5322d]" : "bg-slate-400"
                  }`}
                  style={{ width: `${Math.max(prob * 100, 1.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
