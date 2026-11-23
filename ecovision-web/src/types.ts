export type WasteClass = "cardboard" | "glass" | "metal" | "paper" | "plastic" | "trash";

export interface Prediction {
  class: WasteClass;
  confidence: number;
  probabilities: Record<WasteClass, number>;
}

export interface WasteMeta {
  spanishName: string;
  color: string;
  bgLight: string;
  borderLight: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  tip: string;
  binColor: string;
  binBg: string;
  binBorder: string;
  binText: string;
}

export const WASTE_METADATA: Record<WasteClass, WasteMeta> = {
  cardboard: {
    spanishName: "Cartón",
    color: "text-amber-800",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-300",
    badgeBg: "bg-amber-700",
    badgeText: "text-white",
    icon: "📦",
    binColor: "Contenedor Azul / Café",
    binBg: "bg-blue-600",
    binBorder: "border-blue-700",
    binText: "text-white",
    tip: "Desarma las cajas para reducir volumen. Retira cintas adhesivas gruesas y grapas. No debe estar manchado con aceite ni comida."
  },
  glass: {
    spanishName: "Vidrio",
    color: "text-emerald-800",
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-300",
    badgeBg: "bg-emerald-700",
    badgeText: "text-white",
    icon: "🍾",
    binColor: "Contenedor Verde",
    binBg: "bg-emerald-600",
    binBorder: "border-emerald-700",
    binText: "text-white",
    tip: "Enjuaga botellas y frascos antes de desecharlos. Retira las tapas metálicas o de plástico. No deposites cristalería rota, porcelana ni bombillas."
  },
  metal: {
    spanishName: "Metal",
    color: "text-slate-800",
    bgLight: "bg-slate-50",
    borderLight: "border-slate-300",
    badgeBg: "bg-slate-700",
    badgeText: "text-white",
    icon: "🥫",
    binColor: "Contenedor Amarillo / Gris",
    binBg: "bg-yellow-500",
    binBorder: "border-yellow-600",
    binText: "text-slate-950",
    tip: "Enjuaga bien las latas de refresco y conservas. Aplástalas cuidadosamente con el pie o la mano para ahorrar espacio. El aluminio se recicla infinitas veces."
  },
  paper: {
    spanishName: "Papel",
    color: "text-blue-800",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-300",
    badgeBg: "bg-blue-700",
    badgeText: "text-white",
    icon: "📄",
    binColor: "Contenedor Azul",
    binBg: "bg-blue-600",
    binBorder: "border-blue-700",
    binText: "text-white",
    tip: "Mantén el papel seco, liso y limpio. Retira espirales plásticas o broches metálicos. No incluyas servilletas usadas, papel higiénico ni papel encerado."
  },
  plastic: {
    spanishName: "Plástico",
    color: "text-amber-800",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-300",
    badgeBg: "bg-yellow-600",
    badgeText: "text-white",
    icon: "🥤",
    binColor: "Contenedor Amarillo",
    binBg: "bg-yellow-500",
    binBorder: "border-yellow-600",
    binText: "text-slate-950",
    tip: "Vacía completamente el líquido, enjuaga rápido y comprime la botella. Coloca la tapa nuevamente dentro del contenedor amarillo."
  },
  trash: {
    spanishName: "No Reciclable / Otros",
    color: "text-rose-800",
    bgLight: "bg-rose-50",
    borderLight: "border-rose-300",
    badgeBg: "bg-slate-700",
    badgeText: "text-white",
    icon: "🗑️",
    binColor: "Contenedor Gris / Negro (Basura Ordinaria)",
    binBg: "bg-slate-700",
    binBorder: "border-slate-800",
    binText: "text-white",
    tip: "Este material no es apto para reciclaje común o contiene restos orgánicos. Deposítalo en el contenedor de basura ordinaria o no aprovechable."
  }
};

export interface HistoryItem {
  id: string;
  timestamp: number;
  imagePreviewUrl: string;
  prediction: Prediction;
}
