export type LinkType = "app" | "whatsapp" | "whatsapp-group" | "social" | "web";

export interface Link {
  name: string;
  type: LinkType;
  appUrl: string;
  webUrl: string;
  appStore: string;
  playStore: string;
  phone?: string;
  message?: string;
  packageName?: string;
  bundleId?: string;
}
