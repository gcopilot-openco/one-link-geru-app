import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });

const db = admin.firestore();

const links: Record<string, any> = {
  geru: {
    name: "Geru",
    type: "app",
    appUrl: "geru://app",
    webUrl: "https://geru.com.br",
    appStore: "https://apps.apple.com/br/app/geru/id1449866201",
    playStore: "https://play.google.com/store/apps/details?id=br.com.geru",
    packageName: "br.com.geru",
    bundleId: "br.com.geru",
  },
  whatsapp: {
    name: "Geru WhatsApp",
    type: "whatsapp",
    appUrl: "whatsapp://send?phone=5511999999999",
    webUrl: "https://wa.me/5511999999999",
    appStore: "https://apps.apple.com/br/app/whatsapp/id310633997",
    playStore: "https://play.google.com/store/apps/details?id=com.whatsapp",
    phone: "5511999999999",
  },
  achadinhos: {
    name: "Achadinhos Geru",
    type: "whatsapp-group",
    appUrl: "https://chat.whatsapp.com/BQqXm75Ihil4cYJ5UHhvBO",
    webUrl: "https://chat.whatsapp.com/BQqXm75Ihil4cYJ5UHhvBO",
    appStore: "https://apps.apple.com/br/app/whatsapp/id310633997",
    playStore: "https://play.google.com/store/apps/details?id=com.whatsapp",
  },
};

async function seed() {
  for (const [id, data] of Object.entries(links)) {
    await db.collection("links").doc(id).set(data);
    console.log("✅ Criado:", id);
  }
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
