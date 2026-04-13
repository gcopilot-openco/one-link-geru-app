import "server-only";
import { getDb } from "@/lib/firebase-admin";
import { Link } from "@/lib/types";

const COLLECTION = "links";

export async function getLinkById(id: string): Promise<Link | null> {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION).doc(id).get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshot.data() as Link;
}

export async function getAllLinks(): Promise<Record<string, Link>> {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION).get();
  const links: Record<string, Link> = {};
  snapshot.forEach((doc) => {
    links[doc.id] = doc.data() as Link;
  });
  return links;
}
