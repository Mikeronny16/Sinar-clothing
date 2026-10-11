import type { Product } from "@/lib/supabase"

export type CatId = "all" | "tops" | "dresses" | "jeans" | "knit"

export const CATS: { id: CatId; mm: string; en: string; match: (p: Product) => boolean }[] = [
  { id: "all", mm: "အားလုံး", en: "All", match: () => true },
  { id: "tops", mm: "အင်္ကျီ", en: "Tops", match: (p) => p.category === "Tops" },
  { id: "dresses", mm: "ဝတ်စုံ", en: "Dresses", match: (p) => p.category === "Dresses" },
  { id: "jeans", mm: "ဂျင်း", en: "Jeans", match: (p) => p.category === "Jeans" },
  { id: "knit", mm: "Knit", en: "Knit", match: (p) => p.category === "Sweaters" || p.category === "Cardigans" },
]
