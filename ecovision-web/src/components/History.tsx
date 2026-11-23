import React from "react";
import { HistoryItem, WASTE_METADATA } from "../types";
import { History as HistoryIcon, Trash2, ArrowRight } from "lucide-react";

interface HistoryProps {
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ items, onSelectItem, onClear }) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-slate-800">
          <HistoryIcon className="w-4 h-4 text-[#e5322d]" />
          <h3 className="text-sm font-bold">Historial de análisis recientes ({items.length})</h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Borrar historial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const meta = WASTE_METADATA[item.prediction.class] || WASTE_METADATA.trash;
          const conf = (item.prediction.confidence * 100).toFixed(0);

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm cursor-pointer transition-colors"
            >
              <img
                src={item.imagePreviewUrl}
                alt={meta.spanishName}
                className="w-12 h-12 rounded object-cover bg-slate-100 shrink-0 border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{meta.icon}</span>
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {meta.spanishName}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  {conf}% confianza • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
