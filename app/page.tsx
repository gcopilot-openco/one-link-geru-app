import { getDeviceInfo } from "@/lib/device";

export default async function HomePage() {
  const device = await getDeviceInfo();

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
