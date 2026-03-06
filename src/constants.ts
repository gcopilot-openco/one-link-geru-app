import { Links } from "./types";

const links: Links = {
  geru: {
    name: "Geru",
    type: "app",
    appUrl: "geru://home",
    webUrl: "https://www.geru.com.br",
    appStore:
      "https://apps.apple.com/br/app/geru-cr%C3%A9dito-e-pix-parcelado/id1587713422",
    playStore:
      "https://play.google.com/store/apps/details?id=com.geru.app&hl=pt_BR&gl=BR",
    packageName: "com.geru.app",
    bundleId: "com.geru.app",
  },
  whatsapp: {
    name: "WhatsApp Geru",
    type: "whatsapp",
    appUrl: "whatsapp://send?phone=5511999999999&text=Ol%C3%A1!",
    webUrl: "https://wa.me/5511999999999?text=Ol%C3%A1!",
    appStore: "https://apps.apple.com/app/whatsapp-messenger/id310633997",
    playStore: "https://play.google.com/store/apps/details?id=com.whatsapp",
    phone: "5511999999999",
    message: "Olá!",
  },
};

export default links;
