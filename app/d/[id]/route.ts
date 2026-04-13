import { NextRequest, NextResponse } from "next/server";
import { getLinkById } from "@/lib/links";

export const dynamic = "force-dynamic";

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

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const link = await getLinkById(id);

  if (!link) {
    return NextResponse.json({ error: "Link não encontrado." }, { status: 404 });
  }

  const target = appendMissingQueryParams(link.appUrl, request.nextUrl.searchParams);
  return NextResponse.redirect(target, 302);
}
