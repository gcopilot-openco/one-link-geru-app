"use client";

import { useMemo } from "react";

type DeviceInfo = {
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

function getDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return {
      deviceType: "Desktop",
      platform: "Desktop",
      browser: "Desconhecido",
      os: "Desconhecido",
    };
  }

  const userAgent = window.navigator.userAgent ?? "";
  const isTablet = /ipad|tablet/i.test(userAgent);
  const isiOS = /iphone|ipad|ipod/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);
  const isMobile = /mobile|iphone|ipod|android/i.test(userAgent) || isTablet;

  return {
    deviceType: isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop",
    platform: isiOS ? "iOS" : isAndroid ? "Android" : "Desktop",
    browser: parseBrowser(userAgent),
    os: parseOs(userAgent),
  };
}

export default function HomeClient() {
  const device = useMemo(() => getDeviceInfo(), []);

  return (
    <>
      <section className="hero">
        <div className="hero-eyebrow">Deep Link — Redirect</div>
        <h1>
          Crédito para quem
          <br />
          é <em>comprometido.</em>
        </h1>
        <p>
          Links inteligentes que abrem o app Geru instalado ou direcionam para a loja —
          automaticamente.
        </p>
      </section>

      <div className="divider" />

      <section className="card">
        <div className="card-title">Seu dispositivo</div>
        <div className="device-grid">
          <div className="device-item">
            <div className="label">Tipo</div>
            <div className="value">{device.deviceType}</div>
          </div>
          <div className="device-item">
            <div className="label">Plataforma</div>
            <div className="value">{device.platform}</div>
          </div>
          <div className="device-item">
            <div className="label">Navegador</div>
            <div className="value">{device.browser}</div>
          </div>
          <div className="device-item">
            <div className="label">Sistema</div>
            <div className="value">{device.os}</div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-title">Links disponíveis</div>
        <ul className="link-list">
          <li>
            <a href="/geru" className="link-item">
              <span className="link-item-left">
                <span className="link-logo" aria-hidden>
                  💸
                </span>
                <span>
                  <span className="link-name">Geru</span>
                  <span className="link-path">/geru</span>
                </span>
              </span>
              <span className="link-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="/achadinhos" className="link-item">
              <span className="link-item-left">
                <span className="link-logo" aria-hidden>
                  🛍️
                </span>
                <span>
                  <span className="link-name">Achadinhos da Geru</span>
                  <span className="link-path">/achadinhos</span>
                </span>
              </span>
              <span className="link-arrow">→</span>
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
