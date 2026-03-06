import { getFirestore } from "./firebase";
import { Link } from "../types";

const COLLECTION = "links";

export async function getLinkById(id: string): Promise<Link | null> {
  const db = getFirestore();
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as Link;
}

export async function getAllLinks(): Promise<Record<string, Link>> {
  const db = getFirestore();
  const snapshot = await db.collection(COLLECTION).get();
  const links: Record<string, Link> = {};
  snapshot.forEach((doc) => { links[doc.id] = doc.data() as Link; });
  return links;
}
