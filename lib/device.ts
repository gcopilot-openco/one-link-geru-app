import { headers } from "next/headers";

export type DeviceInfo = {
  isMobile: boolean;
  isiOS: boolean;
  isAndroid: boolean;
  isTablet: boolean;
  deviceType: "Mobile" | "Tablet" | "Desktop";
  platform: string;
  browser: string;
  os: string;
};

function parseBrowser(userAgent: string): string {
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|crios/i.test(userAgent)) return "Chrome";
  if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) return "Safari";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/opr\//i.test(userAgent)) return "Opera";
  return "Desconhecido";
}

function parseOs(userAgent: string): string {
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os x/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Desconhecido";
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isTablet = /ipad|tablet/i.test(userAgent);
  const isiOS = /iphone|ipad|ipod/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);
  const isMobile = /mobile|iphone|ipod|android/i.test(userAgent) || isTablet;

  return {
    isMobile,
    isiOS,
    isAndroid,
    isTablet,
    deviceType: isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop",
    platform: isiOS ? "iOS" : isAndroid ? "Android" : "Desktop",
    browser: parseBrowser(userAgent),
    os: parseOs(userAgent),
  };
}
