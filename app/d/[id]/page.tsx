import RedirectClient from "@/components/redirect-client";
import { getLinkById } from "@/lib/links";

export const dynamic = "force-dynamic";

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
 * Fluxo agnóstico de plataforma (delegado ao RedirectClient):
 *   - Mobile iOS     → tenta abrir appUrl; fallback para appStore
 *   - Mobile Android → tenta abrir appUrl; fallback para playStore
 *   - Desktop        → redireciona para webUrl
 */
export default async function LinkRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const incomingParams = normalizeSearchParams(resolvedSearchParams);
  const qs = incomingParams.toString();

  const link = await getLinkById(id);

  if (link) {
    // Deeplink do Firestore — usa URLs configuradas no documento
    const webUrlWithParams = appendMissingQueryParams(link.webUrl, incomingParams);
    const appUrlWithParams = appendMissingQueryParams(link.appUrl, incomingParams);
    const appStoreWithParams = appendMissingQueryParams(link.appStore, incomingParams);
    const playStoreWithParams = appendMissingQueryParams(link.playStore, incomingParams);

    return (
      <RedirectClient
        appUrl={appUrlWithParams}
        appStore={appStoreWithParams}
        playStore={playStoreWithParams}
        webUrl={webUrlWithParams}
        linkName={link.name}
      />
    );
  }

  // Deeplink nativo do app — monta geru://app/{id} com URLs fixas da Geru
  const appUrl = appendQueryString(`geru://app/${id}`, qs);
  const appStore = appendQueryString(GERU_APP_STORE, qs);
  const playStore = appendQueryString(GERU_PLAY_STORE, qs);
  const webUrl = appendQueryString(GERU_WEB_URL, qs);

  return (
    <RedirectClient
      appUrl={appUrl}
      appStore={appStore}
      playStore={playStore}
      webUrl={webUrl}
      linkName="Geru App"
    />
  );
}
