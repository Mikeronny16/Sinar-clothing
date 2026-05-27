import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { supabase, isConfigured, type Product } from "@/lib/supabase"
import { SITE } from "@/config"
import { FALLBACK_IMG } from "@/lib/products"
import { getLocalAnalytics, getLast7Days, getTodayVisits, getTotalVisits } from "@/lib/analytics"
import {
  Plus, Pencil, Trash2, X, Loader2, LogOut, Upload, Eye,
  LayoutDashboard, Package, BarChart2, TrendingUp, Users,
  ShoppingBag, AlertCircle, CheckCircle, Tag, Search, ToggleLeft, ToggleRight
} from "lucide-react"
import { toast } from "sonner"
import Logo from "@/components/Logo"

type Tab = "dashboard" | "products" | "insights"

type FormData = {
  name_mm: string
  name_en: string
  category: string
  price: number
  sizes: string
  status: string
  image_url: string
  sold_out: boolean
  sort_order: number
}

const CATEGORIES = ["Tops", "Cardigans", "Dresses", "Jeans", "Sweaters"]
const STATUSES = ["In Stock", "Low Stock", "Out of Stock"]

const inp = "w-full bg-[#0A1A0F] border border-[#1C3020] focus:border-[#FF1F6E] rounded-xl px-4 py-2.5 text-sm text-[#F5F0E8] placeholder-[#4A6350] focus:outline-none transition-colors"
const lbl = "text-[10px] font-semibold text-[#7A8F7D] uppercase tracking-widest block mb-1.5"

// ─── Product Form Modal ───────────────────────────────────────────────────────
function ProductForm({ initial, onClose, onSave }: {
  initial?: Product | null
  onClose: () => void
  onSave: (data: FormData & { id?: string }) => Promise<void>
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: initial ? {
      name_mm: initial.name_mm, name_en: initial.name_en,
      category: initial.category, price: initial.price,
      sizes: initial.sizes.join(", "), status: initial.status,
      image_url: initial.image_url, sold_out: initial.sold_out,
      sort_order: initial.sort_order,
    } : { status: "In Stock", sold_out: false, sort_order: 99, price: 0 },
  })

  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(initial?.image_url || "")

  async function uploadImage(file: File) {
    setUploading(true)
    try {
      const ext = file.name.split(".").pop()
      const path = `${Date.now()}.${ext}`
      const { error } = await supabase.storage.from("product-images").upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from("product-images").getPublicUrl(path)
      setImagePreview(data.publicUrl)
      return data.publicUrl
    } catch {
      toast.error("Image upload မအောင်မြင်ပါ")
      return null
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0F2415] rounded-2xl border border-[#1C3020] w-full max-w-lg my-4">
        <div className="flex items-center justify-between p-6 border-b border-[#1C3020]">
          <div>
            <h2 className="font-serif text-xl text-[#F5F0E8]">
              {initial ? "ပစ္စည်း ပြင်ဆင်ရန်" : "ပစ္စည်းအသစ် ထည့်ရန်"}
            </h2>
            <p className="text-[11px] text-[#7A8F7D] mt-0.5">{initial ? "Edit Product" : "Add New Product"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#0A1A0F] text-[#7A8F7D] hover:text-[#F5F0E8] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(async (d) => onSave({ ...d, id: initial?.id, image_url: imagePreview || d.image_url }))} className="p-6 space-y-5">
          {/* Image */}
          <div>
            <label className={lbl}>ပုံ / Image</label>
            {imagePreview && (
              <div className="relative mb-2 rounded-xl overflow-hidden h-36">
                <img src={imagePreview} onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
            <div className="flex gap-2">
              <input {...register("image_url")} placeholder="Image URL (https://...)" className={inp + " flex-1 text-xs"} onChange={(e) => setImagePreview(e.target.value)} />
              <label className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border border-[#1C3020] cursor-pointer hover:border-[#FF1F6E] text-[#7A8F7D] hover:text-[#FF1F6E] transition-colors whitespace-nowrap ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Upload
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => {
                  const f = e.target.files?.[0]; if (f) { const u = await uploadImage(f); if (u) setImagePreview(u) }
                }} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>မြန်မာနာမည် *</label>
              <input {...register("name_mm", { required: "လိုအပ်သည်" })} className={inp + " font-mm"} placeholder="ဝတ်စုံနာမည်" />
              {errors.name_mm && <p className="text-[#FF1F6E] text-xs mt-1">{errors.name_mm.message}</p>}
            </div>
            <div>
              <label className={lbl}>English Name *</label>
              <input {...register("name_en", { required: "Required" })} className={inp} placeholder="Product name" />
              {errors.name_en && <p className="text-[#FF1F6E] text-xs mt-1">{errors.name_en.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Category *</label>
              <select {...register("category", { required: true })} className={inp}>
                <option value="">ရွေးချယ်ပါ</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Status</label>
              <select {...register("status")} className={inp}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>ဈေးနှုန်း (ကျပ်)</label>
              <input type="number" {...register("price", { valueAsNumber: true, min: 0 })} className={inp} placeholder="18000" />
            </div>
            <div>
              <label className={lbl}>Sort Order</label>
              <input type="number" {...register("sort_order", { valueAsNumber: true })} className={inp} />
            </div>
          </div>

          <div>
            <label className={lbl}>Sizes (comma separated)</label>
            <input {...register("sizes")} placeholder="S, M, L, XL or 28, 29, 30" className={inp} />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A1A0F] border border-[#1C3020]">
            <input type="checkbox" {...register("sold_out")} id="sold_out" className="w-4 h-4 accent-[#FF1F6E]" />
            <label htmlFor="sold_out" className="text-sm font-mm text-[#F5F0E8] cursor-pointer">Sold Out အမှတ်အသား</label>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-[#1C3020] text-[#7A8F7D] hover:text-[#F5F0E8] py-3 rounded-xl text-sm font-mm hover:border-[#FF1F6E]/40 transition-colors">
              ဖျက်သိမ်းမည်
            </button>
            <button type="submit" disabled={isSubmitting || uploading} className="flex-1 bg-[#FF1F6E] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#e0185f] disabled:opacity-50 flex items-center justify-center gap-2 font-mm transition-colors">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              သိမ်းဆည်းမည်
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className="bg-[#0F2415] border border-[#1C3020] rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[11px] text-[#7A8F7D] uppercase tracking-widest font-semibold">{label}</p>
        <p className="text-2xl font-bold text-[#F5F0E8] mt-0.5 font-serif">{value}</p>
        {sub && <p className="text-xs text-[#7A8F7D] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data }: { data: { date: string; visits: number }[] }) {
  const max = Math.max(...data.map((d) => d.visits), 1)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((d, i) => {
        const pct = (d.visits / max) * 100
        const dayName = days[new Date(d.date + "T00:00:00").getDay()]
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[9px] text-[#7A8F7D]">{d.visits > 0 ? d.visits : ""}</span>
            <div className="w-full rounded-t-md bg-[#0A1A0F] relative overflow-hidden" style={{ height: "64px" }}>
              <div
                className="absolute bottom-0 inset-x-0 bg-[#FF1F6E] rounded-t-md transition-all duration-700"
                style={{ height: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <span className="text-[9px] text-[#4A6350]">{dayName}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>("dashboard")
  const [editing, setEditing] = useState<Product | null | "new">(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState("All")

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order").order("created_at", { ascending: false })
      if (error) throw error
      return data as Product[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (payload: FormData & { id?: string }) => {
      const sizes = (payload.sizes as unknown as string).split(",").map((s) => s.trim()).filter(Boolean)
      const row = { ...payload, sizes }
      if (payload.id) {
        const { error } = await supabase.from("products").update(row).eq("id", payload.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("products").insert(row)
        if (error) throw error
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["products"] }); toast.success("သိမ်းဆည်းပြီး!"); setEditing(null) },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["products"] }); toast.success("ဖျက်ပြီး!"); setDeleting(null) },
    onError: (e: Error) => toast.error(e.message),
  })

  const toggleSoldOut = useMutation({
    mutationFn: async ({ id, sold_out }: { id: string; sold_out: boolean }) => {
      const { error } = await supabase.from("products").update({ sold_out }).eq("id", id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["products"] }) },
    onError: (e: Error) => toast.error(e.message),
  })

  function handleLogout() {
    localStorage.removeItem("sinar_admin_auth")
    navigate("/auth", { replace: true })
  }

  // ── Stats ──
  const totalProducts = products.length
  const inStock = products.filter((p) => !p.sold_out).length
  const soldOut = products.filter((p) => p.sold_out).length
  const categories = [...new Set(products.map((p) => p.category))].length
  const todayVisits = getTodayVisits()
  const totalVisits = getTotalVisits()
  const weekData = getLast7Days()
  const allAnalytics = getLocalAnalytics()

  // ── Filtered products ──
  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name_mm.includes(search) || p.name_en.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === "All" || p.category === filterCat
    return matchSearch && matchCat
  })

  const tabs = [
    { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { key: "products", icon: Package, label: "ပစ္စည်းများ" },
    { key: "insights", icon: BarChart2, label: "Insights" },
  ] as const

  return (
    <div className="min-h-screen bg-[#0A1A0F] flex flex-col">
      {/* ── Top bar ── */}
      <header className="bg-[#0F2415] border-b border-[#1C3020] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <a href="/" className="flex-shrink-0">
            <Logo variant="dark" size="sm" />
          </a>

          <div className="flex items-center gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tab === t.key
                    ? "bg-[#FF1F6E] text-white"
                    : "text-[#7A8F7D] hover:text-[#F5F0E8] hover:bg-[#1C3020]"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                <span className={`hidden sm:inline ${t.key === "products" ? "font-mm" : ""}`}>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="p-2 text-[#7A8F7D] hover:text-[#F5F0E8] transition-colors" title="Website ကြည့်ရန်">
              <Eye className="w-4 h-4" />
            </a>
            <button onClick={handleLogout} className="p-2 text-[#7A8F7D] hover:text-[#FF1F6E] transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-8">

        {/* ══ DASHBOARD TAB ══════════════════════════════════════════════════ */}
        {tab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-2xl text-[#F5F0E8]">Dashboard</h1>
              <p className="text-[#7A8F7D] text-sm mt-1 font-mm">Sinar Clothing Admin</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Package} label="Total Products" value={totalProducts} sub="ပစ္စည်းအားလုံး" color="bg-blue-500/20 text-blue-400" />
              <StatCard icon={CheckCircle} label="In Stock" value={inStock} sub="ရောင်းလို့ရသည်" color="bg-emerald-500/20 text-emerald-400" />
              <StatCard icon={AlertCircle} label="Sold Out" value={soldOut} sub="ကုန်သွားသည်" color="bg-red-500/20 text-red-400" />
              <StatCard icon={Tag} label="Categories" value={categories} sub="အမျိုးအစား" color="bg-purple-500/20 text-purple-400" />
            </div>

            {/* Visit stats + quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visit stats */}
              <div className="bg-[#0F2415] border border-[#1C3020] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[#F5F0E8] font-semibold">Page Visits</h3>
                    <p className="text-[11px] text-[#7A8F7D] mt-0.5">ဒီနေ့: {todayVisits} · စုစုပေါင်း: {totalVisits}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-[#FF1F6E]" />
                </div>
                <MiniBarChart data={weekData} />
              </div>

              {/* Quick actions */}
              <div className="bg-[#0F2415] border border-[#1C3020] rounded-2xl p-6">
                <h3 className="text-[#F5F0E8] font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => { setTab("products"); setEditing("new") }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#FF1F6E]/10 border border-[#FF1F6E]/20 text-[#FF1F6E] hover:bg-[#FF1F6E]/20 transition-colors text-sm font-mm"
                  >
                    <Plus className="w-4 h-4" />
                    ပစ္စည်းအသစ် ထည့်ရန်
                  </button>
                  <button
                    onClick={() => setTab("products")}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#0A1A0F] border border-[#1C3020] text-[#7A8F7D] hover:text-[#F5F0E8] hover:border-[#2D4A35] transition-colors text-sm font-mm"
                  >
                    <Package className="w-4 h-4" />
                    ပစ္စည်းများ စီမံရန်
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#0A1A0F] border border-[#1C3020] text-[#7A8F7D] hover:text-[#F5F0E8] hover:border-[#2D4A35] transition-colors text-sm font-mm"
                  >
                    <Eye className="w-4 h-4" />
                    Website ကြည့်ရန်
                  </a>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="bg-[#0F2415] border border-[#1C3020] rounded-2xl p-6">
              <h3 className="text-[#F5F0E8] font-semibold mb-5">Category Breakdown</h3>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length
                  const pct = totalProducts > 0 ? (count / totalProducts) * 100 : 0
                  return (
                    <div key={cat} className="flex items-center gap-4">
                      <span className="text-xs text-[#7A8F7D] w-20 flex-shrink-0">{cat}</span>
                      <div className="flex-1 h-2 bg-[#0A1A0F] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF1F6E] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-[#F5F0E8] font-bold w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ PRODUCTS TAB ═══════════════════════════════════════════════════ */}
        {tab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl text-[#F5F0E8]">ပစ္စည်းများ</h1>
                <p className="text-[#7A8F7D] text-sm mt-0.5">ပစ္စည်း {products.length} ခု · ပြနေသည် {filtered.length} ခု</p>
              </div>
              <button
                onClick={() => setEditing("new")}
                className="flex items-center gap-2 bg-[#FF1F6E] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#e0185f] transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="font-mm">ပစ္စည်းအသစ်</span>
              </button>
            </div>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A6350]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ပစ္စည်းရှာရန်..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F2415] border border-[#1C3020] rounded-xl text-sm text-[#F5F0E8] placeholder-[#4A6350] focus:outline-none focus:border-[#FF1F6E] transition-colors font-mm"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {["All", ...CATEGORIES].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterCat(c)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      filterCat === c
                        ? "bg-[#FF1F6E] text-white"
                        : "bg-[#0F2415] border border-[#1C3020] text-[#7A8F7D] hover:text-[#F5F0E8]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF1F6E]" />
              </div>
            ) : (
              <div className="bg-[#0F2415] rounded-2xl border border-[#1C3020] overflow-hidden">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1C3020]">
                        {["ပုံ", "ပစ္စည်း", "Category", "ဈေးနှုန်း", "Sizes", "Status", "Sold Out", ""].map((h) => (
                          <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold text-[#4A6350] uppercase tracking-widest whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr key={p.id} className="border-b border-[#1C3020] last:border-0 hover:bg-[#0A1A0F]/50 transition-colors group">
                          <td className="px-5 py-3">
                            <img src={p.image_url || FALLBACK_IMG} alt={p.name_en}
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                              className="w-12 h-12 rounded-xl object-cover border border-[#1C3020] group-hover:border-[#FF1F6E]/20 transition-colors" />
                          </td>
                          <td className="px-5 py-3 min-w-[140px]">
                            <p className="font-mm font-semibold text-sm text-[#F5F0E8] leading-snug">{p.name_mm}</p>
                            <p className="text-xs text-[#7A8F7D] mt-0.5">{p.name_en}</p>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs bg-[#0A1A0F] border border-[#1C3020] text-[#7A8F7D] px-2.5 py-1 rounded-full">{p.category}</span>
                          </td>
                          <td className="px-5 py-3">
                            <span className="font-mm font-bold text-sm text-[#FF1F6E]">
                              {p.price > 0 ? `${p.price.toLocaleString()} ကျပ်` : "—"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-1 flex-wrap max-w-[80px]">
                              {p.sizes.map((s) => (
                                <span key={s} className="text-[9px] border border-[#1C3020] text-[#4A6350] px-1.5 py-0.5 rounded font-bold">{s}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap ${
                              p.status === "In Stock" ? "bg-emerald-500/15 text-emerald-400" :
                              p.status === "Low Stock" ? "bg-yellow-500/15 text-yellow-400" :
                              "bg-red-500/15 text-red-400"
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => toggleSoldOut.mutate({ id: p.id, sold_out: !p.sold_out })}
                              className={`flex items-center gap-1.5 text-xs transition-colors ${p.sold_out ? "text-[#FF1F6E]" : "text-[#4A6350] hover:text-[#F5F0E8]"}`}
                            >
                              {p.sold_out
                                ? <ToggleRight className="w-5 h-5" />
                                : <ToggleLeft className="w-5 h-5" />}
                              <span className="font-bold">{p.sold_out ? "ON" : "OFF"}</span>
                            </button>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditing(p)} className="p-2 rounded-lg hover:bg-[#0A1A0F] text-[#7A8F7D] hover:text-[#F5F0E8] transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setDeleting(p.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#7A8F7D] hover:text-red-400 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-[#1C3020]">
                  {filtered.map((p) => (
                    <div key={p.id} className="p-4 flex items-center gap-4">
                      <img src={p.image_url || FALLBACK_IMG} alt={p.name_en}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                        className="w-16 h-16 rounded-xl object-cover border border-[#1C3020] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-mm font-semibold text-sm text-[#F5F0E8] truncate">{p.name_mm}</p>
                        <p className="text-xs text-[#7A8F7D]">{p.category}</p>
                        {p.price > 0 && <p className="font-mm text-xs font-bold text-[#FF1F6E] mt-0.5">{p.price.toLocaleString()} ကျပ်</p>}
                        {p.sold_out && <span className="text-[9px] bg-[#FF1F6E]/15 text-[#FF1F6E] px-2 py-0.5 rounded-full font-bold mt-1 inline-block">SOLD OUT</span>}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button onClick={() => setEditing(p)} className="p-1.5 text-[#7A8F7D] hover:text-[#F5F0E8]"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleting(p.id)} className="p-1.5 text-[#7A8F7D] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        <button onClick={() => toggleSoldOut.mutate({ id: p.id, sold_out: !p.sold_out })}
                          className={p.sold_out ? "text-[#FF1F6E]" : "text-[#4A6350]"}>
                          {p.sold_out ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-10 h-10 text-[#1C3020] mx-auto mb-3" />
                    <p className="text-[#7A8F7D] font-mm text-sm">ပစ္စည်းမတွေ့ပါ</p>
                    <button onClick={() => { setSearch(""); setFilterCat("All") }} className="mt-2 text-[#FF1F6E] text-xs font-mm">Filter ဖယ်ရှားရန်</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ INSIGHTS TAB ═══════════════════════════════════════════════════ */}
        {tab === "insights" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-2xl text-[#F5F0E8]">Insights</h1>
              <p className="text-[#7A8F7D] text-sm mt-1 font-mm">Website reach နှင့် analytics</p>
            </div>

            {/* Visit overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Today Visits" value={todayVisits} sub="ဒီနေ့ ဝင်သည်" color="bg-[#FF1F6E]/20 text-[#FF1F6E]" />
              <StatCard icon={TrendingUp} label="Total Visits" value={totalVisits} sub="စုစုပေါင်း" color="bg-blue-500/20 text-blue-400" />
              <StatCard icon={BarChart2} label="This Week" value={weekData.reduce((s, d) => s + d.visits, 0)} sub="ဒီတပတ်" color="bg-purple-500/20 text-purple-400" />
              <StatCard icon={Eye} label="Pages Tracked" value={allAnalytics.length} sub={`${allAnalytics.length} ရက်`} color="bg-emerald-500/20 text-emerald-400" />
            </div>

            {/* Weekly chart */}
            <div className="bg-[#0F2415] border border-[#1C3020] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#F5F0E8] font-semibold">Weekly Visits</h3>
                <span className="text-[10px] text-[#7A8F7D] uppercase tracking-wider">Last 7 days</span>
              </div>
              <MiniBarChart data={weekData} />
            </div>

            {/* Daily history */}
            <div className="bg-[#0F2415] border border-[#1C3020] rounded-2xl p-6">
              <h3 className="text-[#F5F0E8] font-semibold mb-5">Visit History</h3>
              {allAnalytics.length === 0 ? (
                <p className="text-[#4A6350] text-sm font-mm text-center py-8">Data မရှိသေးပါ — website ကိုဝင်ကြည့်ပါ</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {[...allAnalytics].reverse().map((d) => (
                    <div key={d.date} className="flex items-center justify-between py-2.5 border-b border-[#1C3020] last:border-0">
                      <span className="text-sm text-[#7A8F7D]">{d.date}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-[#0A1A0F] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF1F6E] rounded-full"
                            style={{ width: `${Math.min((d.visits / Math.max(...allAnalytics.map(x => x.visits))) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-[#F5F0E8] w-8 text-right">{d.visits}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Note</p>
              <p className="text-[#7A8F7D] text-sm leading-relaxed font-mm">
                Analytics data ကို browser localStorage မှ ကောက်ယူသည်။ Real-time data အတွက် Supabase ကို configure လုပ်ပြီး{" "}
                <code className="text-blue-400 text-xs">page_visits</code> table ဆောက်ပါ (date TEXT, visits INT)။
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {editing !== null && (
        <ProductForm
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (d) => { await saveMutation.mutateAsync(d as FormData & { id?: string }) }}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F2415] rounded-2xl border border-[#1C3020] p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="font-serif text-lg text-[#F5F0E8] mb-2">ဖျက်ရန် သေချာပါသလား?</h3>
            <p className="text-[#7A8F7D] text-sm font-mm mb-6">ဤ action ကို ပြန်မဖြစ်နိုင်ပါ</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 border border-[#1C3020] text-[#7A8F7D] hover:text-[#F5F0E8] py-2.5 rounded-xl text-sm font-mm hover:border-[#2D4A35] transition-colors">
                မဖျက်တော့ပါ
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleting)}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2 font-mm transition-colors"
              >
                {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                ဖျက်မည်
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
