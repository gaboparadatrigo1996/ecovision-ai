import React, { useEffect, useRef } from "react";
import { X, Cpu, ShieldAlert, Database, Award } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="backdrop:bg-slate-900/60 rounded-2xl p-0 max-w-lg w-[92vw] shadow-xl bg-white text-slate-900 border border-slate-300"
    >
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♻️</span>
            <h2 className="text-lg font-bold text-slate-900">Acerca de EcoVision AI</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <div className="flex gap-3 items-start">
            <Cpu className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Arquitectura del Modelo:</strong>
              <p>
                MobileNetV2 pre-entrenada en ImageNet con <i>transfer learning</i>. Cuenta con 164,742 parámetros entrenables en su clasificador personalizado (GlobalAveragePooling2D → Dropout → Dense).
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Rendimiento en Test:</strong>
              <p>
                Evaluado con 379 imágenes del conjunto de test: <strong>88.65% de exactitud global</strong>, Macro-F1 de 0.869 y AUC macro de 0.986.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Database className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Dataset de Entrenamiento:</strong>
              <p>
                TrashNet (Stanford, 2,527 imágenes) dividido de manera estratificada en 6 categorías: cartón, vidrio, metal, papel, plástico y otros.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex gap-2.5 items-start">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-xs font-bold">Limitaciones conocidas:</strong>
              <p>
                TrashNet contiene imágenes con fondo blanco e iluminación de estudio. En fotos tomadas con fondos heterogéneos, la precisión puede variar. Se recomienda capturar un solo residuo centrado con buena iluminación.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </dialog>
  );
};
