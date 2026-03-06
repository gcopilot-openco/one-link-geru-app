import { Request, Response } from "express";

class Home {
  static render(req: Request, res: Response): void {
    const ua = req.useragent;
    res.render("home", {
      title: "Geru Link — Redirecionamento Inteligente",
      deviceType: ua?.isMobile ? "Mobile" : ua?.isTablet ? "Tablet" : "Desktop",
      platform: ua?.platform || "Desconhecido",
      browser: ua?.browser || "Desconhecido",
      os: ua?.os || "Desconhecido",
      currentYear: new Date().getFullYear(),
    });
  }
}

export default Home;
