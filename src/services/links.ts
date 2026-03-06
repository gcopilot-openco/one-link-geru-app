import { Link } from "../types";
import links from "../constants";

export async function getLinkById(id: string): Promise<Link | null> {
  return links[id] ?? null;
}

export async function getAllLinks(): Promise<Record<string, Link>> {
  return links;
}
