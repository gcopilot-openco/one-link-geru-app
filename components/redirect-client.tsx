"use client";

import { useEffect } from "react";

type RedirectClientProps = {
  appUrl: string;
  store: string;
  linkName: string;
};

export default function RedirectClient({ appUrl, store, linkName }: RedirectClientProps) {
  useEffect(() => {
    const timeout = 2000;
    const start = Date.now();

    window.location.href = appUrl;

    const fallbackTimer = window.setTimeout(() => {
      if (Date.now() - start < timeout + 100) {
        const message = document.getElementById("message");
        if (message) {
          message.textContent = "Redirecionando para a loja...";
        }
        window.location.href = store;
      }
    }, timeout);

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(fallbackTimer);
      }
    };

    const onBlur = () => {
      window.clearTimeout(fallbackTimer);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [appUrl, store]);

  return (
    <div className="download-page">
      <div className="logo-center">
        <img src="/assets/geru-logo.svg" alt="Geru" />
      </div>
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
      <h1>Abrindo {linkName}...</h1>
      <p id="message">Tentando abrir o aplicativo...</p>
    </div>
  );
}
