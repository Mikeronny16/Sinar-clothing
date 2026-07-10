import { useState } from "react"
import { Plus, Pencil, Trash2, X, RotateCcw, Film as FilmIcon, PlayCircle } from "lucide-react"
import { toast } from "sonner"
import { getFilms, saveFilms, resetFilms, type Film } from "@/lib/films"

const inp = "w-full bg-[#0A1A0F] border border-[#1C3020] focus:border-[#C08A78] rounded-xl px-4 py-2.5 text-sm text-[#F5F0E8] placeholder-[#4A6350] focus:outline-none transition-colors"
const lbl = "text-[10px] font-semibold text-[#7A8F7D] uppercase tracking-widest block mb-1.5"

const EMPTY: Film = { id: "", title_en: "", title_mm: "", tag_en: "", tag_mm: "", runtime: "", src: "", poster: "" }

function FilmForm({ initial, onClose, onSave }: { initial: Film; onClose: () => void; onSave: (f: Film) => void }) {
  const [f, setF] = useState<Film>(initial)
  const set = (k: keyof Film) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  const submit = () => {
    if (!f.title_en.trim() && !f.title_mm.trim()) { toast.error("Title လိုအပ်သည်"); return }
    if (!f.src.trim()) { toast.error("Video URL လိုအပ်သည်"); return }
    onSave({ ...f, id: f.id || `film-${Date.now()}` })
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0F2415] rounded-2xl border border-[#1C3020] w-full max-w-lg my-4">
        <div className="flex items-center justify-between p-6 border-b border-[#1C3020]">
          <div>
            <h2 className="font-serif text-xl text-[#F5F0E8]">{initial.id ? "ဗီဒီယို ပြင်ဆင်ရန်" : "ဗီဒီယိုအသစ် ထည့်ရန်"}</h2>
            <p className="text-[11px] text-[#7A8F7D] mt-0.5">{initial.id ? "Edit Film" : "Add Film"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#0A1A0F] text-[#7A8F7D] hover:text-[#F5F0E8] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {f.poster && (
            <div className="relative rounded-xl overflow-hidden h-36">
              <img src={f.poster} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>English Title</label>
              <input value={f.title_en} onChange={set("title_en")} className={inp} placeholder="Autumn Campaign" />
            </div>
            <div>
              <label className={lbl}>မြန်မာ ခေါင်းစဉ်</label>
              <input value={f.title_mm} onChange={set("title_mm")} className={inp + " font-mm"} placeholder="ဆောင်းဦး ကမ်ပိန်း" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={lbl}>Tag (EN)</label>
              <input value={f.tag_en} onChange={set("tag_en")} className={inp} placeholder="Campaign" />
            </div>
            <div>
              <label className={lbl}>Tag (MM)</label>
              <input value={f.tag_mm} onChange={set("tag_mm")} className={inp + " font-mm"} placeholder="ကမ်ပိန်း" />
            </div>
            <div>
              <label className={lbl}>Runtime</label>
              <input value={f.runtime} onChange={set("runtime")} className={inp} placeholder="1:12" />
            </div>
          </div>
          <div>
            <label className={lbl}>Video URL *</label>
            <input value={f.src} onChange={set("src")} className={inp + " text-xs"} placeholder="/film/campaign.mp4 or https://..." />
            <p className="text-[10px] text-[#4A6350] mt-1">Upload .mp4 to <code className="text-[#C08A78]">/public/film/</code> then use <code className="text-[#C08A78]">/film/name.mp4</code>, or paste any direct video link.</p>
          </div>
          <div>
            <label className={lbl}>Poster image URL</label>
            <input value={f.poster} onChange={set("poster")} className={inp + " text-xs"} placeholder="https://... (thumbnail)" />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-[#1C3020] text-[#7A8F7D] hover:text-[#F5F0E8] py-3 rounded-xl text-sm font-mm hover:border-[#C08A78]/40 transition-colors">
              ဖျက်သိမ်းမည်
            </button>
            <button onClick={submit} className="flex-1 bg-[#C08A78] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#a86f5c] flex items-center justify-center gap-2 font-mm transition-colors">
              သိမ်းဆည်းမည်
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FilmsManager() {
  const [films, setFilms] = useState<Film[]>(getFilms)
  const [editing, setEditing] = useState<Film | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const persist = (next: Film[]) => { setFilms(next); saveFilms(next) }

  const handleSave = (film: Film) => {
    const exists = films.some((x) => x.id === film.id)
    const next = exists ? films.map((x) => (x.id === film.id ? film : x)) : [...films, film]
    persist(next)
    setEditing(null)
    toast.success("သိမ်းဆည်းပြီး!")
  }

  const handleDelete = (id: string) => {
    persist(films.filter((x) => x.id !== id))
    setDeleting(null)
    toast.success("ဖျက်ပြီး!")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-[#F5F0E8]">ဗီဒီယိုများ</h1>
          <p className="text-[#7A8F7D] text-sm mt-0.5">Film / Lookbook · {films.length} ခု</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { resetFilms(); setFilms(getFilms()); toast.success("Default သို့ ပြန်လည်သတ်မှတ်ပြီး") }}
            className="flex items-center gap-2 border border-[#1C3020] text-[#7A8F7D] hover:text-[#F5F0E8] px-4 py-2.5 rounded-full text-xs font-semibold hover:border-[#C08A78]/40 transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="flex items-center gap-2 bg-[#C08A78] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#a86f5c] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="font-mm">ဗီဒီယိုအသစ်</span>
          </button>
        </div>
      </div>

      {films.length === 0 ? (
        <div className="text-center py-16 bg-[#0F2415] rounded-2xl border border-[#1C3020]">
          <FilmIcon className="w-10 h-10 text-[#1C3020] mx-auto mb-3" />
          <p className="text-[#7A8F7D] font-mm text-sm">ဗီဒီယိုမရှိသေးပါ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {films.map((f) => (
            <div key={f.id} className="bg-[#0F2415] rounded-2xl border border-[#1C3020] overflow-hidden group">
              <div className="relative aspect-video bg-[#0A1A0F]">
                {f.poster
                  ? <img src={f.poster} alt={f.title_en} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><PlayCircle className="w-8 h-8 text-[#1C3020]" /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-2 right-2 text-[10px] text-white/90 tracking-wider">{f.runtime}</span>
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditing(f)} className="p-1.5 rounded-lg bg-black/50 text-white/80 hover:text-white transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleting(f.id)} className="p-1.5 rounded-lg bg-black/50 text-white/80 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-mm text-sm text-[#F5F0E8] leading-snug">{f.title_mm || f.title_en}</p>
                <p className="text-xs text-[#7A8F7D] mt-0.5">{f.title_en}</p>
                <span className="inline-block mt-2 text-[9px] uppercase tracking-widest text-[#C08A78] border border-[#C08A78]/30 px-2 py-0.5 rounded-full">{f.tag_en || "Film"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <FilmForm initial={editing} onClose={() => setEditing(null)} onSave={handleSave} />}

      {deleting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F2415] rounded-2xl border border-[#1C3020] p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="font-serif text-lg text-[#F5F0E8] mb-2">ဗီဒီယို ဖျက်ရန်?</h3>
            <p className="text-[#7A8F7D] text-sm font-mm mb-6">ဤ action ကို ပြန်မဖြစ်နိုင်ပါ</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 border border-[#1C3020] text-[#7A8F7D] hover:text-[#F5F0E8] py-2.5 rounded-xl text-sm font-mm transition-colors">
                မဖျက်တော့ပါ
              </button>
              <button onClick={() => handleDelete(deleting)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 font-mm transition-colors">
                ဖျက်မည်
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
