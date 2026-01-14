import type { Nanny } from "@/types/nanny";
import type { PriceFilter, SortOption } from "@/types/filters";

export function applyFiltersAndSort(params: {
  items: Nanny[];
  sort: SortOption;
  price: PriceFilter;
}): Nanny[] {
  const { items, sort, price } = params;

  let out = [...items];

  if (price === "LT_10") out = out.filter((n) => n.price_per_hour < 10);
  if (price === "GT_10") out = out.filter((n) => n.price_per_hour > 10);

  switch (sort) {
    case "A_Z":
      return out.sort((a, b) => a.name.localeCompare(b.name));
    case "Z_A":
      return out.sort((a, b) => b.name.localeCompare(a.name));
    case "RATING_ASC":
      return out.sort((a, b) => a.rating - b.rating);
    case "RATING_DESC":
      return out.sort((a, b) => b.rating - a.rating);
    case "SHOW_ALL":
    default:
      return out;
  }
}
