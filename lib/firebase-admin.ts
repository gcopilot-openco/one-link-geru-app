import "server-only";
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let firestoreInstance: Firestore | null = null;

function bootstrapFirebase(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (clientEmail && privateKey) {
    if (!projectId) {
      throw new Error(
        "`FIREBASE_PROJECT_ID` é obrigatório quando `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY` são usados."
      );
    }

    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  if (projectId) {
    return initializeApp({ projectId });
  }

  return initializeApp();
}

export function getFirebaseApp(): App {
  return bootstrapFirebase();
}

export function getDb(): Firestore {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = bootstrapFirebase();
  firestoreInstance = getFirestore(app);
  return firestoreInstance;
}

export function getStorageBucket(name?: string) {
  const app = bootstrapFirebase();
  const bucketName =
    name ??
    process.env.FIREBASE_STORAGE_BUCKET ??
    `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
  return getStorage(app).bucket(bucketName);
}
