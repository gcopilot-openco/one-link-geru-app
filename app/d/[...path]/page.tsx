import { notFound, redirect } from "next/navigation";
import RedirectClient, { buildRedirectScript } from "@/components/redirect-client";
import { getDeviceInfo } from "@/lib/device";

/**
 * Rota catch-all de deeplinks internos do Geru App.
 *
 * Padrão: /d/{geru-app-path}
 *
 * Exemplos:
 *   /d/home                       → geru://app/home
 *   /d/payment/payment/list       → geru://app/payment/payment/list
 *   /d/product/geru-pay           → geru://app/product/geru-pay
 *   /d/personal-loan/simulation   → geru://app/personal-loan/simulation
 *
 * Otimizações de velocidade:
 *   - Desktop recebe HTTP 302 imediato (sem renderizar nada)
 *   - Mobile recebe script inline que inicia o redirect ANTES da hidratação React
 */

/** URLs fixas do app Geru — independentes do link configurado no Firestore */
const GERU_APP_STORE = "https://apps.apple.com/br/app/geru/id1449866201";
const GERU_PLAY_STORE =
  "https://play.google.com/store/apps/details?id=br.com.geru";
const GERU_WEB_URL = "https://geru.com.br";

type Params = {
  path: string[];
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function buildQueryString(searchParams: SearchParams): string {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    }
  });
  return params.toString();
}

function appendQueryString(base: string, qs: string): string {
  if (!qs) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${qs}`;
}

export default async function DeeplinkPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ path: segments }, resolvedSearchParams, device] = await Promise.all([
    params,
    searchParams,
    getDeviceInfo(),
  ]);

  if (!segments || segments.length === 0) {
    notFound();
  }

  // Valida que não há segmentos vazios nem caracteres suspeitos
  const isValid = segments.every((s) => s.length > 0 && /^[\w\-./]+$/.test(s));
  if (!isValid) {
    notFound();
  }

  const deepPath = segments.join("/");
  const qs = buildQueryString(resolvedSearchParams);

  // Monta o deep link: geru://app/{path}?{qs}
  const appUrl   = appendQueryString(`geru://app/${deepPath}`, qs);
  const appStore = appendQueryString(GERU_APP_STORE, qs);
  const playStore= appendQueryString(GERU_PLAY_STORE, qs);
  const webUrl   = appendQueryString(GERU_WEB_URL, qs);

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
        linkName="Geru App"
        isMobile={device.isMobile}
        isiOS={device.isiOS}
      />
    </>
  );
}
