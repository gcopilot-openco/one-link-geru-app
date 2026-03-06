export type LinkType = "app" | "whatsapp" | "whatsapp-group" | "social" | "web";

export interface Link {
  name: string;
  type: LinkType;
  appUrl: string;
  webUrl: string;
  appStore: string;
  playStore: string;
  // Campos específicos para WhatsApp
  phone?: string;
  message?: string;
  // Campos específicos para apps nativos
  packageName?: string; // Android
  bundleId?: string;    // iOS
}

export interface Links {
  [key: string]: Link;
}
