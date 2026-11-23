import { Prediction } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Redimensiona una imagen en el cliente si es muy pesada (> 1600px)
 * para optimizar la transferencia y latencia.
 */
async function optimizeImageForUpload(file: File): Promise<Blob> {
  if (file.size < 1.5 * 1024 * 1024) {
    return file; // Si pesa menos de 1.5 MB, la enviamos directa
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => resolve(blob || file),
            "image/jpeg",
            0.88
          );
        } else {
          resolve(file);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function predict(file: File): Promise<Prediction> {
  const optimizedBlob = await optimizeImageForUpload(file);
  const formData = new FormData();
  formData.append("file", optimizedBlob, file.name);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMsg = "Error en el servidor al clasificar.";
      try {
        const errorData = await res.json();
        if (errorData.detail) errorMsg = errorData.detail;
      } catch {
        // Ignorar error al parsear json
      }
      throw new Error(errorMsg);
    }

    const data: Prediction = await res.json();
    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new Error(
          "El servidor tardó demasiado en responder (puede estar iniciando o despertando)."
        );
      }
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        throw new Error(
          `No se pudo conectar con la API en ${API_BASE_URL}. Asegúrate de que el backend esté corriendo.`
        );
      }
      throw err;
    }
    throw new Error("Ocurrió un error inesperado al conectar con el clasificador.");
  }
}

export async function checkHealth(): Promise<{ ok: boolean; model_loaded: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) return { ok: false, model_loaded: false };
    return await res.json();
  } catch {
    return { ok: false, model_loaded: false };
  }
}
