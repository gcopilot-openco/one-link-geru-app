import { Request, Response } from "express";
import { getLinkById } from "../services/links";

class Redirect {
  static async renderRedirectPage(req: Request, res: Response): Promise<void> {
    const linkId = req.params.id as string;

    try {
      const link = await getLinkById(linkId);

      if (!link) {
        res.status(404).render("404", { linkId });
        return;
      }

      console.log(
        `[${new Date().toISOString()}] ${linkId} (${link.type}) - ${
          req.useragent?.isMobile ? "Mobile" : "Desktop"
        } - ${req.useragent?.platform}`
      );

      if (req.useragent?.isMobile) {
        res.render("redirect", {
          appUrl: link.appUrl,
          store: req.useragent?.isiOS ? link.appStore : link.playStore,
          title: `Redirecionando para ${link.name}...`,
          isiOS: req.useragent?.isiOS,
          layout: "download",
          linkName: link.name,
          linkType: link.type,
        });
        return;
      }

      res.redirect(link.webUrl);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Erro ao buscar link "${linkId}":`, error);
      res.status(500).render("404", { linkId, error: "Erro interno ao buscar o link." });
    }
  }
}

export default Redirect;
