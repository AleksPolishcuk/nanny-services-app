export type SortOption =
  | "A_Z"
  | "Z_A"
  | "RATING_ASC"
  | "RATING_DESC"
  | "SHOW_ALL";

export type PriceFilter = "ALL" | "LT_10" | "GT_10";

export type FilterOption = SortOption | "LT_10" | "GT_10" | "ALL";
