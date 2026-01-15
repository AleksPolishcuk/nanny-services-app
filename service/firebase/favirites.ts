import { get, ref, update } from "firebase/database";
import { db } from "@/service/firebase/firebase";
import type { Nanny } from "@/types/nanny";

export async function getFavoriteIds(uid: string): Promise<string[]> {
  const snap = await get(ref(db, `users/${uid}/favorites`));
  if (!snap.exists()) return [];
  const v = snap.val() as Record<string, boolean>;
  return Object.keys(v).filter((id) => v[id]);
}

export async function setFavorite(
  uid: string,
  nannyId: string,
  value: boolean
) {
  await update(ref(db, `users/${uid}/favorites`), { [nannyId]: value });
}

export async function toggleFavorite(
  uid: string,
  nannyId: string,
  nextValue?: boolean
) {
  const value = typeof nextValue === "boolean" ? nextValue : true;
  await setFavorite(uid, nannyId, value);
}

export async function getNanniesByIds(ids: string[]): Promise<Nanny[]> {
  if (ids.length === 0) return [];
  const res: Nanny[] = [];

  for (const id of ids) {
    const snap = await get(ref(db, `nannies/${id}`));
    if (snap.exists()) {
      res.push({ id, ...(snap.val() as Omit<Nanny, "id">) });
    }
  }
  return res;
}
