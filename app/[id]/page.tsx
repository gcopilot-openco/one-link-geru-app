import { notFound } from "next/navigation";
import RedirectClient from "@/components/redirect-client";
import { getLinkById } from "@/lib/links";

export const dynamic = "force-dynamic";

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
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const incomingParams = normalizeSearchParams(resolvedSearchParams);
  const link = await getLinkById(id);

  if (!link) {
    notFound();
  }

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
