import * as admin from "firebase-admin";

let initialized = false;

export function initFirebase(): void {
  if (initialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const databaseId = process.env.FIREBASE_DATABASE_ID ?? "(default)";

  if (!projectId) {
    throw new Error("Variável FIREBASE_PROJECT_ID não configurada.");
  }

  // Usa Application Default Credentials (ADC) em todos os ambientes:
  // - Local: requer `gcloud auth application-default login`
  // - Cloud Run: usa a Service Account atribuída via IAM automaticamente
  admin.initializeApp({ projectId });
  console.log(`🔥 Firebase inicializado (ADC) — projeto: ${projectId}`);

  if (databaseId !== "(default)") {
    admin.firestore().settings({ databaseId });
    console.log(`📦 Firestore database: ${databaseId}`);
  }

  initialized = true;
}

export function getFirestore(): admin.firestore.Firestore {
  if (!initialized) {
    throw new Error("Firebase não inicializado. Chame initFirebase() primeiro.");
  }
  return admin.firestore();
}
