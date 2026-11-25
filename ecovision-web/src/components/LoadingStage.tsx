import React, { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

export const LoadingStage: React.FC<{ filename?: string }> = ({ filename }) => {
  const [takingLonger, setTakingLonger] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTakingLonger(true), 12000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <section className="loading-stage" aria-busy="true" aria-labelledby="loading-title">
      <div className="loading-card">
        <div className="loading-orbit" aria-hidden="true"><Leaf size={32} strokeWidth={1.5} /></div>
        <span className="section-kicker">UNA NUEVA PERSPECTIVA</span>
        <h1 id="loading-title">Cada material tiene<br />otra oportunidad.</h1>
        <p role="status">{takingLonger ? "El servicio está tardando un poco más. Seguimos esperando tu resultado…" : "Estamos analizando tu imagen para ayudarte a reciclar mejor."}</p>
        <div className="indeterminate-track" aria-hidden="true"><span /></div>
        <span className="loading-filename">{filename}</span>
        <p className="loading-note">Mantén esta ventana abierta mientras terminamos.</p>
      </div>
    </section>
  );
};
