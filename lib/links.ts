import "server-only";
import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/firebase-admin";
import { Link } from "@/lib/types";

const COLLECTION = "links";

/** TTL de cache em segundos — 5 minutos é suficiente para links que raramente mudam */
const CACHE_TTL = 300;

async function fetchLinkById(id: string): Promise<Link | null> {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION).doc(id).get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshot.data() as Link;
}

/**
 * Busca um link pelo ID com cache de servidor.
 * Requests repetidos dentro do TTL não fazem round-trip ao Firestore.
 */
export const getLinkById = unstable_cache(
  fetchLinkById,
  ["link-by-id"],
  { revalidate: CACHE_TTL, tags: ["links"] }
);

async function fetchAllLinks(): Promise<Record<string, Link>> {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION).get();
  const links: Record<string, Link> = {};
  snapshot.forEach((doc) => {
    links[doc.id] = doc.data() as Link;
  });
  return links;
}

export const getAllLinks = unstable_cache(
  fetchAllLinks,
  ["all-links"],
  { revalidate: CACHE_TTL, tags: ["links"] }
);
