import { notFound, redirect } from "next/navigation";
import RedirectClient from "@/components/redirect-client";
import { getDeviceInfo } from "@/lib/device";
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

  const device = await getDeviceInfo();

  console.log(
    `[${new Date().toISOString()}] ${id} (${link.type}) - ${device.isMobile ? "Mobile" : "Desktop"} - ${device.platform}`
  );

  const webUrlWithParams = appendMissingQueryParams(link.webUrl, incomingParams);
  const appUrlWithParams = appendMissingQueryParams(link.appUrl, incomingParams);

  if (!device.isMobile) {
    redirect(webUrlWithParams);
  }

  const store = device.isiOS ? link.appStore : link.playStore;
  const storeWithParams = appendMissingQueryParams(store, incomingParams);

  return <RedirectClient appUrl={appUrlWithParams} store={storeWithParams} linkName={link.name} />;
}
