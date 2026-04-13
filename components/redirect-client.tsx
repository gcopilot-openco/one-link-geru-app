"use client";

import { useEffect } from "react";

type RedirectClientProps = {
  appUrl: string;
  appStore: string;
  playStore: string;
  webUrl: string;
  linkName: string;
};

function getMobileContext(userAgent: string): { isMobile: boolean; isiOS: boolean } {
  const normalized = userAgent.toLowerCase();
  const isiOS = /iphone|ipad|ipod/.test(normalized);
  const isAndroid = /android/.test(normalized);
  const isMobile = /mobile|iphone|ipod|android|ipad|tablet/.test(normalized);

  return {
    isMobile: isMobile || isiOS || isAndroid,
    isiOS,
  };
}

export default function RedirectClient({
  appUrl,
  appStore,
  playStore,
  webUrl,
  linkName,
}: RedirectClientProps) {
  useEffect(() => {
    const userAgent = navigator.userAgent ?? "";
    const { isMobile, isiOS } = getMobileContext(userAgent);

    if (!isMobile) {
      window.location.replace(webUrl);
      return;
    }

    const store = isiOS ? appStore : playStore;
    const timeout = 2000;
    const start = Date.now();

    window.location.replace(appUrl);

    const fallbackTimer = window.setTimeout(() => {
      if (Date.now() - start < timeout + 100) {
        const message = document.getElementById("message");
        if (message) {
          message.textContent = "Redirecionando para a loja...";
        }
        window.location.replace(store);
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
  }, [appStore, appUrl, playStore, webUrl]);

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
