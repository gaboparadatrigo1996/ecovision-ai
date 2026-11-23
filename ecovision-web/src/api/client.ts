import { Prediction } from "../types";

const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_BASE_URL = RAW_URL.replace(/\/+$/, "");

/**
 * Redimensiona una imagen en el cliente si es muy pesada (> 1400px)
 * para optimizar la transferencia, ancho de banda y latencia hacia la API en la nube.
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

  // Render en plan gratis puede tardar hasta 45s en despertar de reposo (cold start)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 65000);

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
          "El servidor en la nube tardó demasiado en responder. Si Render estaba en reposo, dale 30 segundos y reintenta."
        );
      }
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        throw new Error(
          `No se pudo conectar con la API en ${API_BASE_URL}. Verifica que el servicio en Render esté activo.`
        );
      }
      throw err;
    }
    throw new Error("Ocurrió un error inesperado al conectar con el clasificador.");
  }
}

export async function checkHealth(): Promise<{ ok: boolean; model_loaded: boolean; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Accept": "application/json"
      }
    });
    clearTimeout(timer);
    if (!res.ok) {
      return { ok: false, model_loaded: false, error: `Estado HTTP ${res.status}` };
    }
    const data = await res.json();
    return { ok: Boolean(data.ok), model_loaded: Boolean(data.model_loaded) };
  } catch (err: unknown) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("Fallo al verificar API en:", `${API_BASE_URL}/health`, err);
    return { ok: false, model_loaded: false, error: msg };
  }
}
