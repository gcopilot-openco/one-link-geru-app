import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geru Link — Redirecionamento Inteligente",
  description: "Links inteligentes que abrem app ou loja automaticamente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header>
          <a href="/" className="logo" aria-label="Voltar para a home">
            <img src="/assets/geru-logo.svg" alt="Geru" />
          </a>
        </header>
        <main>{children}</main>
        <footer>&copy; {new Date().getFullYear()} Geru · Crédito e Pix Parcelado</footer>
      </body>
    </html>
  );
}
