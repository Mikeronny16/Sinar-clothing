import { useQuery } from "@tanstack/react-query"
import { supabase, isConfigured, type Product } from "./supabase"
import { FALLBACK_PRODUCTS } from "./products"

// Single source of truth for the product list (live Supabase, or fallback demo).
export function useProducts(): Product[] {
  const { data: live } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as Product[]
    },
    enabled: isConfigured,
  })
  return live && live.length > 0 ? live : (FALLBACK_PRODUCTS as unknown as Product[])
}
