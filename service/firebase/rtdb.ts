import {
  get,
  query,
  ref,
  orderByChild,
  startAt,
  limitToFirst,
} from "firebase/database";
import { db } from "@/service/firebase/firebase";
import type { Nanny } from "@/types/nanny";

export type NanniesCursor = { createdAt: number; id: string } | null;

function compare(
  a: Pick<Nanny, "createdAt" | "id">,
  b: Pick<Nanny, "createdAt" | "id">
) {
  if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
  return a.id.localeCompare(b.id);
}

function isAfter(
  item: Pick<Nanny, "createdAt" | "id">,
  cursor: { createdAt: number; id: string }
) {
  if (item.createdAt !== cursor.createdAt)
    return item.createdAt > cursor.createdAt;
  return item.id.localeCompare(cursor.id) > 0;
}

export async function getNanniesPage(params: {
  limit: number;
  cursor: NanniesCursor;
}): Promise<{ items: Nanny[]; cursor: NanniesCursor; hasMore: boolean }> {
  const { limit, cursor } = params;

  const baseRef = ref(db, "nannies");
  const limitPlusOne = limit + 1;

  const q = cursor
    ? query(
        baseRef,
        orderByChild("createdAt"),
        startAt(cursor.createdAt),
        limitToFirst(limitPlusOne * 6)
      )
    : query(baseRef, orderByChild("createdAt"), limitToFirst(limitPlusOne));

  const snap = await get(q);

  if (!snap.exists()) return { items: [], cursor: null, hasMore: false };

  const raw = snap.val() as Record<string, Omit<Nanny, "id">>;
  const all = Object.entries(raw).map(([id, value]) => ({ id, ...value }));
  all.sort(compare);

  const filtered = cursor ? all.filter((x) => isAfter(x, cursor)) : all;

  const pageSlice = filtered.slice(0, limitPlusOne);
  const hasMore = pageSlice.length > limit;

  const items = pageSlice.slice(0, limit);

  const nextCursor =
    items.length > 0
      ? {
          createdAt: items[items.length - 1]!.createdAt,
          id: items[items.length - 1]!.id,
        }
      : cursor;

  return { items, cursor: nextCursor, hasMore };
}
