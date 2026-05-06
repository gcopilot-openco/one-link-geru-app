import { redirect } from "next/navigation";
import RedirectClient, { buildRedirectScript } from "@/components/redirect-client";
import { getLinkById } from "@/lib/links";
import { getDeviceInfo } from "@/lib/device";

/** URLs fixas do app Geru — usadas como fallback para deeplinks nativos */
const GERU_APP_STORE = "https://apps.apple.com/br/app/geru/id1449866201";
const GERU_PLAY_STORE =
  "https://play.google.com/store/apps/details?id=br.com.geru";
const GERU_WEB_URL = "https://geru.com.br";

type Params = {
  id: string;
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function normalizeSearchParams(searchParams: SearchParams): URLSearchParams {
  const normalized = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      normalized.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => normalized.append(key, item));
    }
  });

  return normalized;
}

function appendMissingQueryParams(
  targetUrl: string,
  incomingParams: URLSearchParams
): string {
  if (!incomingParams.toString()) {
    return targetUrl;
  }

  const url = new URL(targetUrl);

  incomingParams.forEach((value, key) => {
    if (!url.searchParams.has(key)) {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

function appendQueryString(base: string, qs: string): string {
  if (!qs) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${qs}`;
}

/**
 * Rota /d/{id} — deeplink com resolução em dois estágios:
 *
 * 1. Tenta encontrar o documento pelo ID no Firestore (coleção "links").
 *    Caso encontre, usa as URLs configuradas (appUrl, webUrl, appStore, playStore).
 *
 * 2. Se o documento não existir no Firestore (deeplink nativo do app Geru,
 *    como "home", "login", "register" etc.), trata como deeplink interno:
 *    monta `geru://app/{id}` e usa as URLs fixas da loja / site da Geru.
 *
 * Otimizações de velocidade:
 *   - Desktop recebe HTTP 302 imediato (sem renderizar nada)
 *   - Mobile recebe script inline que inicia o redirect ANTES da hidratação React
 *   - Dados do Firestore são servidos do cache (TTL 5 min)
 */
export default async function LinkRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ id }, resolvedSearchParams, device] = await Promise.all([
    params,
    searchParams,
    getDeviceInfo(),
  ]);

  const incomingParams = normalizeSearchParams(resolvedSearchParams);
  const qs = incomingParams.toString();

  const link = await getLinkById(id);

  let appUrl:    string;
  let appStore:  string;
  let playStore: string;
  let webUrl:    string;
  let linkName:  string;

  if (link) {
    // Deeplink do Firestore — usa URLs configuradas no documento
    appUrl    = appendMissingQueryParams(link.appUrl,   incomingParams);
    appStore  = appendMissingQueryParams(link.appStore, incomingParams);
    playStore = appendMissingQueryParams(link.playStore,incomingParams);
    webUrl    = appendMissingQueryParams(link.webUrl,   incomingParams);
    linkName  = link.name;
  } else {
    // Deeplink nativo do app — monta geru://app/{id} com URLs fixas da Geru
    appUrl    = appendQueryString(`geru://app/${id}`, qs);
    appStore  = appendQueryString(GERU_APP_STORE, qs);
    playStore = appendQueryString(GERU_PLAY_STORE, qs);
    webUrl    = appendQueryString(GERU_WEB_URL, qs);
    linkName  = "Geru App";
  }

  // Desktop: redirect HTTP 302 imediato — sem renderizar nada, sem JS no cliente
  if (!device.isMobile) {
    redirect(webUrl);
  }

  // Mobile: emite script inline que executa ANTES da hidratação React
  const inlineScript = buildRedirectScript({
    appUrl,
    appStore,
    playStore,
    webUrl,
    isMobile: device.isMobile,
    isiOS:    device.isiOS,
  });

  const metaRefreshUrl = device.isiOS ? appStore : playStore;

  return (
    <>
      <meta httpEquiv="refresh" content={`3; url=${metaRefreshUrl}`} />
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
      <RedirectClient
        appUrl={appUrl}
        appStore={appStore}
        playStore={playStore}
        webUrl={webUrl}
        linkName={linkName}
        isMobile={device.isMobile}
        isiOS={device.isiOS}
      />
    </>
  );
}
