import { notFound, redirect } from "next/navigation";
import RedirectClient, { buildRedirectScript } from "@/components/redirect-client";
import { getLinkById } from "@/lib/links";
import { getDeviceInfo } from "@/lib/device";

type Params = {
  id: string;
};

function appendMissingQueryParams(targetUrl: string, incomingParams: URLSearchParams): string {
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
  const link = await getLinkById(id);

  if (!link) {
    notFound();
  }

  const webUrlWithParams   = appendMissingQueryParams(link.webUrl,   incomingParams);
  const appUrlWithParams   = appendMissingQueryParams(link.appUrl,   incomingParams);
  const appStoreWithParams = appendMissingQueryParams(link.appStore, incomingParams);
  const playStoreWithParams= appendMissingQueryParams(link.playStore,incomingParams);

  // Desktop: redirect HTTP 302 imediato — sem renderizar nada, sem JS no cliente
  if (!device.isMobile) {
    redirect(webUrlWithParams);
  }

  // Mobile: emite script inline que executa ANTES da hidratação React
  const inlineScript = buildRedirectScript({
    appUrl:   appUrlWithParams,
    appStore: appStoreWithParams,
    playStore:playStoreWithParams,
    webUrl:   webUrlWithParams,
    isMobile: device.isMobile,
    isiOS:    device.isiOS,
  });

  // URL de destino para o meta refresh (loja se mobile, web se desktop — mas
  // desktop nunca chega aqui devido ao redirect() acima)
  const metaRefreshUrl = device.isiOS ? appStoreWithParams : playStoreWithParams;

  return (
    <>
      {/*
        Meta refresh: safety net para browsers com JS desabilitado ou muito lento.
        Aponta para a loja após 3s — tempo suficiente para o script inline atuar primeiro.
        React 19 faz hoist automático de <meta> para o <head>.
      */}
      <meta httpEquiv="refresh" content={`3; url=${metaRefreshUrl}`} />

      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
      <RedirectClient
        appUrl={appUrlWithParams}
        appStore={appStoreWithParams}
        playStore={playStoreWithParams}
        webUrl={webUrlWithParams}
        linkName={link.name}
        isMobile={device.isMobile}
        isiOS={device.isiOS}
      />
    </>
  );
}
