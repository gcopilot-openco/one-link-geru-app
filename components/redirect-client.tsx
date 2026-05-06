"use client";

import { useEffect } from "react";

type RedirectClientProps = {
  appUrl: string;
  appStore: string;
  playStore: string;
  webUrl: string;
  linkName: string;
  /** Hint vindo do servidor — evita re-detectar UA no cliente */
  isMobile: boolean;
  isiOS: boolean;
};

/**
 * Gera o script de redirect que será embutido inline no HTML.
 *
 * O script executa IMEDIATAMENTE quando o parser HTML o encontra —
 * antes de qualquer download de bundle React, antes da hidratação.
 * Isso elimina ~300-800ms de atraso que existia no useEffect anterior.
 *
 * Para desktop: window.location.replace é chamado instantaneamente.
 * Para mobile:  tenta o deep link (geru://) e agenda fallback para a loja.
 */
export function buildRedirectScript({
  appUrl,
  appStore,
  playStore,
  webUrl,
  isMobile,
  isiOS,
}: Omit<RedirectClientProps, "linkName">): string {
  // JSON.stringify escapa aspas e caracteres especiais de forma segura
  return `
(function() {
  var isMobile = ${JSON.stringify(isMobile)};
  var isiOS    = ${JSON.stringify(isiOS)};
  var appUrl   = ${JSON.stringify(appUrl)};
  var appStore = ${JSON.stringify(appStore)};
  var playStore= ${JSON.stringify(playStore)};
  var webUrl   = ${JSON.stringify(webUrl)};

  if (!isMobile) {
    window.location.replace(webUrl);
    return;
  }

  var store   = isiOS ? appStore : playStore;
  var start   = Date.now();
  var timeout = 2000;

  window.location.replace(appUrl);

  var t = setTimeout(function() {
    if (Date.now() - start < timeout + 100) {
      var el = document.getElementById('message');
      if (el) el.textContent = 'Redirecionando para a loja...';
      window.location.replace(store);
    }
  }, timeout);

  function cancel() { clearTimeout(t); }

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) cancel();
  });
  window.addEventListener('blur', cancel);
})();
`.trim();
}

/**
 * RedirectClient — componente de UI + fallback interativo.
 *
 * O redirect real já foi iniciado pelo script inline embutido no HTML pelo
 * Server Component pai. Este componente serve apenas para:
 *   1. Exibir a tela de "Abrindo..." enquanto o redirect acontece.
 *   2. Atualizar o texto de status via useEffect (caso o redirect demore).
 *   3. Funcionar como safety net caso o script inline falhe por algum motivo.
 */
export default function RedirectClient({
  appUrl,
  appStore,
  playStore,
  webUrl,
  linkName,
  isMobile,
  isiOS,
}: RedirectClientProps) {
  // Safety net: se por algum motivo o script inline não executou,
  // o useEffect repete a lógica. Na prática, raramente chegará aqui.
  useEffect(() => {
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
      if (document.hidden) window.clearTimeout(fallbackTimer);
    };
    const onBlur = () => window.clearTimeout(fallbackTimer);

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [appStore, appUrl, isMobile, isiOS, playStore, webUrl]);

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
