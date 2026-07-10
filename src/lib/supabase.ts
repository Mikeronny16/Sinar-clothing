import { createClient } from "@supabase/supabase-js"

const url: string = import.meta.env.VITE_SUPABASE_URL ?? ""
const key: string = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""

export const isConfigured = !!(url && key)

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder-key"
)

export type Product = {
  id: string
  name_en: string
  name_mm: string
  category: string
  sizes: string[]
  status: string
  image_url: string
  sold_out: boolean
  sort_order: number
  price: number
  original_price?: number | null
  badge?: string | null
  colors?: { name: string; hex: string }[] | null
  created_at: string
  updated_at: string
}
