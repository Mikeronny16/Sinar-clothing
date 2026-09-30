import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"

/**
 * Sinar 3D Boutique — one shop room in her colours (bottle green + blush pink on bone), with every
 * product hung as a lit framed photo. You stand in it first-person: drag to look, tap the floor to
 * walk there, tap a piece to step up to it. WASD / arrows also walk on a computer.
 *
 * Rendering is on demand (only when something moves or a photo arrives) so a phone isn't kept busy
 * while the visitor reads a product card.
 */

export interface BoutiqueItem {
  id: string
  img: string
  soldOut: boolean
  category: string
  price: number
  onSale: boolean
  badge?: string | null
}

export interface BoutiqueEvents {
  onSelect: (index: number | null) => void
  onProgress: (loaded: number, total: number) => void
  /** the counter was tapped: open the bag (pay at the till) */
  onCounter: () => void
  /** the fitting-room curtain was tapped: show the size guide */
  onFitting: () => void
  /** the shop girl's pictures loaded (true) or are not there yet (false) */
  onGirl?: (present: boolean) => void
}

export type GirlPose = "idle" | "wave" | "show" | "thanks"
const POSES: GirlPose[] = ["idle", "wave", "show", "thanks"]

/** Wall signs: English over Burmese. Unknown categories fall back to their own name. */
const CATEGORY_MM: Record<string, string> = {
  Dresses: "ဂါဝန်", Tops: "အပေါ်ဝတ်", Cardigans: "ကာဒီဂင်", Sweaters: "ဆွယ်တာ", Jeans: "ဂျင်း",
}

// room: x -W/2..W/2, z -D/2 (back wall) .. +D/2 (shop front), floor y 0
const W = 12, D = 10, H = 3.6
const EYE = 1.58
const GREEN = 0x2f4a36, GREEN_DEEP = 0x223829, BLUSH = 0xe7c3bf, BONE = 0xf3eee4, BRASS = 0xb99a62, PINK = 0xe79aa8

interface Slot { pos: THREE.Vector3; normal: THREE.Vector3 }
interface Obstacle { x: number; z: number; r: number }

export class Boutique {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(62, 1, 0.05, 60)
  private yaw = 0
  private pitch = -0.04
  private pos = new THREE.Vector3(0, EYE, D / 2 - 0.9)
  private glide: { from: THREE.Vector3; to: THREE.Vector3; yaw0: number; yaw1: number; p0: number; p1: number; t: number; dur: number } | null = null
  private keys = new Set<string>()
  private dirty = true
  private raf = 0
  private last = performance.now()
  private products = new THREE.Group()
  private pickables: THREE.Mesh[] = []
  private slots: Slot[] = []
  private obstacles: Obstacle[] = []
  private floor: THREE.Mesh
  private loader = new THREE.TextureLoader()
  private selected: number | null = null
  private disposed = false
  private hoverEl: HTMLElement
  private items: BoutiqueItem[] = []
  private place: number[] = []           // item index -> slot index
  private soldTex: THREE.Texture
  private counter!: THREE.Mesh
  private curtain!: THREE.Mesh
  private signs = new THREE.Group()
  private girl: THREE.Mesh | null = null
  private girlTex: Partial<Record<GirlPose, THREE.Texture>> = {}
  private girlPose: GirlPose = "idle"
  private girlBob = 0

  constructor(private canvas: HTMLCanvasElement, private ev: BoutiqueEvents) {
    this.hoverEl = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.loader.setCrossOrigin("anonymous")

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.45
    this.scene.background = new THREE.Color(0x1b2a20)
    this.scene.add(new THREE.HemisphereLight(0xfff3ee, 0x4a5a48, 1.25))
    const key = new THREE.DirectionalLight(0xfff0e0, 0.9)
    key.position.set(2, 6, 4)
    this.scene.add(key)

    this.soldTex = labelTexture("SOLD OUT", "#1A1611", "#F3EEE4")
    this.floor = this.buildRoom()
    this.scene.add(this.products, this.signs)
    this.loadGirl()
    this.slots = this.buildSlots()

    this.resize()
    if (this.camera.aspect < 0.8) this.pitch = -0.16   // upright phone: less ceiling, more room
    window.addEventListener("resize", this.resize)
    window.addEventListener("keydown", this.onKey)
    window.addEventListener("keyup", this.onKey)
    this.bindPointer()
    this.loop()
  }

  // ------------------------------------------------------------------ products

  /** (Re)hang the collection. Called again when the live catalogue replaces the fallback. */
  setItems(items: BoutiqueItem[]) {
    // each category starts on a fresh column (its sign needs the space above it)
    this.place = []
    let slot = 0, prevCat = ""
    for (const it of items) {
      if (it.category !== prevCat && slot % 2 === 1) slot++
      prevCat = it.category
      if (slot >= this.slots.length) break
      this.place.push(slot++)
    }
    items = items.slice(0, this.place.length)
    this.items = items
    const used = new Set(this.place)
    for (const m of this.pickables) {
      const mat = m.material as THREE.MeshStandardMaterial
      mat.map?.dispose()
      mat.dispose()
    }
    this.products.clear()
    this.signs.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { (m.material as THREE.MeshBasicMaterial).map?.dispose(); m.geometry.dispose() } })
    this.signs.clear()
    this.pickables = []
    const tags = tagAtlas(items)
    const tagMat = new THREE.MeshBasicMaterial({ map: tags.tex, transparent: true })
    const stringMat = new THREE.MeshBasicMaterial({ color: 0x8a6d44 })
    const frameGeo = new RoundedBoxGeometry(0.7, 0.9, 0.04, 2, 0.012)
    const frameMat = new THREE.MeshStandardMaterial({ color: BRASS, metalness: 0.7, roughness: 0.35 })
    const matGeo = new THREE.PlaneGeometry(0.64, 0.84)
    const matMat = new THREE.MeshStandardMaterial({ color: BONE, roughness: 0.9 })
    const photoGeo = new THREE.PlaneGeometry(0.58, 0.773)
    const soldGeo = new THREE.PlaneGeometry(0.58, 0.12)
    const soldMat = new THREE.MeshBasicMaterial({ map: this.soldTex, transparent: true })
    const lampGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8)
    lampGeo.rotateZ(Math.PI / 2)
    const lampMat = new THREE.MeshStandardMaterial({ color: BRASS, metalness: 0.8, roughness: 0.3 })
    const glowMat = new THREE.MeshBasicMaterial({ map: radialTexture(), color: 0x6a4a2a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
    const glowGeo = new THREE.PlaneGeometry(1.3, 1.5)
    let loaded = 0
    const total = items.length
    this.ev.onProgress(0, total)
    items.forEach((it, i) => {
      const s = this.slots[this.place[i]]
      const g = new THREE.Group()
      g.position.copy(s.pos)
      g.lookAt(s.pos.clone().add(s.normal))
      g.add(new THREE.Mesh(frameGeo, frameMat))
      const mat = new THREE.Mesh(matGeo, matMat)
      mat.position.z = 0.021
      g.add(mat)
      const photoMat = new THREE.MeshStandardMaterial({ color: 0xd9cfc3, roughness: 0.75 })
      const photo = new THREE.Mesh(photoGeo, photoMat)
      photo.position.z = 0.023
      photo.userData.index = i
      g.add(photo)
      this.pickables.push(photo)
      // a warm wash from the picture light, drawn on the wall behind the frame
      const glow = new THREE.Mesh(glowGeo, glowMat)
      glow.position.set(0, 0.12, -0.03)
      g.add(glow)
      // one picture light per column: on the top frame of the column
      if (this.place[i] % 2 === 1 || !used.has(this.place[i] + 1)) {
        const lamp = new THREE.Mesh(lampGeo, lampMat)
        lamp.position.set(0, 0.55, 0.12)
        g.add(lamp)
      }
      // hang tag on the frame's lower-right corner: price, and SALE / badge when there is one
      if (!it.soldOut) {
        const tag = new THREE.Mesh(tagPlane(0.3, 0.12, tags.uv(i)), tagMat)
        tag.position.set(0.24, -0.44, 0.05)
        tag.rotation.z = 0.08
        g.add(tag)
        const str = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.08, 0.002), stringMat)
        str.position.set(0.22, -0.36, 0.045)
        str.rotation.z = 0.5
        g.add(str)
      }
      if (it.soldOut) {
        const sold = new THREE.Mesh(soldGeo, soldMat)
        sold.position.set(0, -0.26, 0.026)
        g.add(sold)
        photoMat.color.setScalar(0.6)
      }
      this.products.add(g)
      this.loader.load(
        it.img,
        (tex) => {
          if (this.disposed) { tex.dispose(); return }
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = 4
          coverFit(tex, 0.58 / 0.773)
          photoMat.map = tex
          photoMat.color.setScalar(it.soldOut ? 0.6 : 1)
          photoMat.needsUpdate = true
          this.ev.onProgress(++loaded, total)
          this.dirty = true
        },
        undefined,
        () => {
          // photo missing: show the house card rather than an empty frame
          photoMat.map = placeholderTexture(it.category)
          photoMat.color.setScalar(it.soldOut ? 0.6 : 1)
          photoMat.needsUpdate = true
          this.ev.onProgress(++loaded, total)
          this.dirty = true
        },
      )
    })
    this.hangSigns(items)
    this.dirty = true
  }

  /** A brass plaque above the first column of every category run: "Dresses / ဂါဝန်". */
  private hangSigns(items: BoutiqueItem[]) {
    const plate = new THREE.MeshStandardMaterial({ color: BRASS, metalness: 0.75, roughness: 0.35 })
    let prev = ""
    items.forEach((it, i) => {
      if (it.category === prev) return
      prev = it.category
      const s = this.slots[this.place[i]]
      const g = new THREE.Group()
      g.position.copy(s.pos).setY(3.02)
      g.lookAt(g.position.clone().add(s.normal))
      g.add(new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.24, 0.02, 2, 0.01), plate))
      const face = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.2), new THREE.MeshBasicMaterial({
        map: signTexture(it.category, CATEGORY_MM[it.category] ?? ""), transparent: true,
      }))
      face.position.z = 0.012
      g.add(face)
      this.signs.add(g)
    })
  }

  // ------------------------------------------------------------------ the shop girl

  /**
   * She is four painted cut-outs on solid blue (public/boutique/girl-*.png). The blue is keyed out
   * here, so the files can be dropped in as generated. If any pose is missing she simply isn't
   * there — the shop works the same without her.
   */
  private async loadGirl() {
    const imgs = await Promise.all(POSES.map((p) => loadImage(`/boutique/girl-${p}.png`)))
    if (this.disposed) return
    if (imgs.some((i) => !i)) { this.ev.onGirl?.(false); return }
    let aspect = 0.5625
    POSES.forEach((p, k) => {
      const img = imgs[k]!
      aspect = img.width / img.height
      this.girlTex[p] = keyBlue(img)
    })
    // stands behind the counter, feet hidden by it; a 1.62 m girl
    const h = 1.62
    const geo = new THREE.PlaneGeometry(h * aspect, h)
    geo.translate(0, h / 2, 0)
    const mat = new THREE.MeshBasicMaterial({ map: this.girlTex.idle!, transparent: true, alphaTest: 0.02, toneMapped: false })
    this.girl = new THREE.Mesh(geo, mat)
    this.girl.position.set(0, 0.02, -D / 2 + 0.62)
    this.girl.renderOrder = 1
    this.scene.add(this.girl)
    this.ev.onGirl?.(true)
    this.dirty = true
  }

  setGirl(pose: GirlPose) {
    if (!this.girl || !this.girlTex[pose] || pose === this.girlPose) return
    this.girlPose = pose
    ;(this.girl.material as THREE.MeshBasicMaterial).map = this.girlTex[pose]!
    this.girlBob = 0.25            // a small hop into the new pose
    this.dirty = true
  }

  /** Stand in front of a piece by id (share links). Returns false when it isn't hung. */
  selectId(id: string) {
    const i = this.items.findIndex((it) => it.id === id)
    if (i < 0) return false
    this.select(i)
    return true
  }

  select(i: number | null) {
    this.selected = i
    this.ev.onSelect(i)
    if (i === null) return
    const s = this.slots[this.place[i]]
    if (!s) return
    // stand back from the frame and aim a little below it, so the piece sits above the card
    const phone = this.camera.aspect < 0.8
    const stand = s.pos.clone().addScaledVector(s.normal, phone ? 1.75 : 1.8).setY(EYE)
    this.clampInside(stand)
    const d = s.pos.clone().setY(s.pos.y - (phone ? 0.45 : 0.32)).sub(stand)
    const yaw = Math.atan2(-d.x, -d.z)
    const pitch = Math.atan2(d.y, Math.hypot(d.x, d.z))
    this.glideTo(stand, yaw, pitch, 0.9)
  }

  step(dir: 1 | -1) {
    const n = this.items.length
    if (!n) return
    const cur = this.selected ?? (dir > 0 ? -1 : 0)
    this.select((cur + dir + n) % n)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener("resize", this.resize)
    window.removeEventListener("keydown", this.onKey)
    window.removeEventListener("keyup", this.onKey)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.geometry.dispose()
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      mats.forEach((mt) => { (mt as THREE.MeshStandardMaterial).map?.dispose(); mt.dispose() })
    })
    this.renderer.dispose()
  }

  // ------------------------------------------------------------------ room

  private buildRoom() {
    const s = this.scene
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, ry = 0) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      m.rotation.y = ry
      s.add(m)
      return m
    }
    // floor: pale oak planks + a round blush rug in the middle
    const floorTex = plankTexture()
    floorTex.repeat.set(W / 1.6, D / 1.6)
    const floorGeo = new THREE.PlaneGeometry(W, D)
    floorGeo.rotateX(-Math.PI / 2)
    const floor = add(floorGeo, new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.7, envMapIntensity: 0.3 }), 0, 0, 0)
    const rug = new THREE.CircleGeometry(1.7, 48)
    rug.rotateX(-Math.PI / 2)
    add(rug, new THREE.MeshStandardMaterial({ color: 0xe2b3b3, roughness: 1 }), 0, 0.005, 0.2)
    const rugEdge = new THREE.RingGeometry(1.62, 1.7, 48)
    rugEdge.rotateX(-Math.PI / 2)
    add(rugEdge, new THREE.MeshStandardMaterial({ color: GREEN, roughness: 1 }), 0, 0.006, 0.2)
    // ceiling with a warm cove
    const ceil = new THREE.PlaneGeometry(W, D)
    ceil.rotateX(Math.PI / 2)
    add(ceil, new THREE.MeshStandardMaterial({ color: 0xf6efe6, emissive: 0x9a8f84, roughness: 1 }), 0, H, 0)
    const coveMat = new THREE.MeshBasicMaterial({ color: 0xffe4c8 })
    for (const [w, x, z, ry] of [[W, 0, -D / 2 + 0.05, 0], [W, 0, D / 2 - 0.05, 0], [D, -W / 2 + 0.05, 0, Math.PI / 2], [D, W / 2 - 0.05, 0, Math.PI / 2]] as const) {
      add(new THREE.BoxGeometry(w, 0.03, 0.03), coveMat, x, H - 0.12, z, ry)
    }

    // walls: bottle-green back wall, blush side walls, green wainscot + brass rail all round
    const back = new THREE.MeshStandardMaterial({ color: GREEN, roughness: 0.85 })
    const blush = new THREE.MeshStandardMaterial({ color: BLUSH, roughness: 0.9 })
    const wains = new THREE.MeshStandardMaterial({ color: GREEN_DEEP, roughness: 0.7 })
    const brass = new THREE.MeshStandardMaterial({ color: BRASS, metalness: 0.8, roughness: 0.3 })
    const wall = (w: number, x: number, z: number, ry: number, mat: THREE.Material) => {
      add(new THREE.PlaneGeometry(w, H), mat, x, H / 2, z, ry)
      add(new THREE.BoxGeometry(w, 0.62, 0.03), wains, x + Math.sin(ry) * 0.015, 0.31, z + Math.cos(ry) * 0.015, ry)
      add(new THREE.BoxGeometry(w, 0.03, 0.05), brass, x + Math.sin(ry) * 0.03, 0.63, z + Math.cos(ry) * 0.03, ry)
      // vertical panel mouldings
      for (let k = -w / 2 + 0.5; k < w / 2; k += 1.0) {
        add(new THREE.BoxGeometry(0.02, 0.5, 0.02), brass, x + Math.cos(ry) * k + Math.sin(ry) * 0.035, 0.32, z - Math.sin(ry) * k + Math.cos(ry) * 0.035, ry)
      }
    }
    wall(W, 0, -D / 2, 0, back)
    wall(D, -W / 2, 0, Math.PI / 2, blush)
    wall(D, W / 2, 0, -Math.PI / 2, blush)
    // shop front: green frame, big window panes either side of an open door
    const frontMat = new THREE.MeshStandardMaterial({ color: GREEN_DEEP, roughness: 0.6 })
    add(new THREE.PlaneGeometry(W, 1.0), frontMat, 0, H - 0.5, D / 2, Math.PI)
    for (const sx of [-1, 1]) {
      add(new THREE.PlaneGeometry(W / 2 - 1.1, 0.5), frontMat, sx * (W / 4 + 0.55), 0.25, D / 2, Math.PI)
      const glass = add(new THREE.PlaneGeometry(W / 2 - 1.1, H - 1.5), new THREE.MeshStandardMaterial({ color: 0xcfe0da, transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.1 }), sx * (W / 4 + 0.55), 0.5 + (H - 1.5) / 2, D / 2, Math.PI)
      glass.renderOrder = 2
      add(new THREE.BoxGeometry(0.08, H, 0.08), brass, sx * 1.1, H / 2, D / 2)
    }
    // outside: a soft mall glow behind the glass
    const outside = new THREE.PlaneGeometry(W + 4, H + 2)
    add(outside, new THREE.MeshBasicMaterial({ color: 0xe9e2d6 }), 0, H / 2, D / 2 + 3, Math.PI)

    // the sign on the back wall: "Sinar" in her script, pink neon on a green arch
    const sign = textTexture("Sinar", '"Kaushan Script", cursive', "#ffd9e0", "#e79aa8")
    const signMesh = add(new THREE.PlaneGeometry(2.6, 1.0), new THREE.MeshBasicMaterial({ map: sign, transparent: true, toneMapped: false }), 0, 2.75, -D / 2 + 0.03)
    signMesh.renderOrder = 3
    const sub = textTexture("MYITKYINA · ချစ်စရာ ဝတ်စုံလေးများ", '500 "Noto Sans Myanmar", "Inter", sans-serif', "#f3eee4", null, 1024, 96, 38)
    add(new THREE.PlaneGeometry(2.6, 0.24), new THREE.MeshBasicMaterial({ map: sub, transparent: true }), 0, 2.08, -D / 2 + 0.03)
    const arch = new THREE.Shape()
    arch.moveTo(-1.6, 0); arch.lineTo(-1.6, 2.2); arch.absarc(0, 2.2, 1.6, Math.PI, 0, true); arch.lineTo(1.6, 0); arch.lineTo(-1.6, 0)
    add(new THREE.ShapeGeometry(arch, 32), new THREE.MeshStandardMaterial({ color: 0x3b5c44, roughness: 0.8 }), 0, 0, -D / 2 + 0.01)

    // counter in front of the sign: green front, bone marble-ish top, flowers, "Order on Viber" plaque
    this.counter = add(new RoundedBoxGeometry(2.4, 0.95, 0.6, 2, 0.04), new THREE.MeshStandardMaterial({ color: GREEN_DEEP, roughness: 0.6 }), 0, 0.475, -D / 2 + 1.1)
    add(new RoundedBoxGeometry(2.5, 0.05, 0.7, 2, 0.02), new THREE.MeshStandardMaterial({ color: BONE, roughness: 0.25 }), 0, 0.975, -D / 2 + 1.1)
    add(new THREE.BoxGeometry(2.3, 0.02, 0.02), brass, 0, 0.12, -D / 2 + 1.41)
    const plaque = textTexture("Pay here · Order on Viber", '600 "Inter", sans-serif', "#F3EEE4", null, 768, 96, 40)
    add(new THREE.PlaneGeometry(1.5, 0.19), new THREE.MeshBasicMaterial({ map: plaque, transparent: true }), 0, 0.6, -D / 2 + 1.405)
    this.flowers(0.8, 1.0, -D / 2 + 1.1, 0.5)
    this.obstacles.push({ x: 0, z: -D / 2 + 1.1, r: 1.35 })

    // centre: tufted blush ottoman on the rug with a tall vase of pink stems
    add(new THREE.CylinderGeometry(0.95, 0.95, 0.42, 40), new THREE.MeshStandardMaterial({ color: PINK, roughness: 0.95 }), 0, 0.21, 0.2)
    add(new THREE.CylinderGeometry(0.97, 0.97, 0.05, 40), new THREE.MeshStandardMaterial({ color: GREEN, roughness: 0.8 }), 0, 0.025, 0.2)
    // a low bowl of pink stems: keeps the sign clear from the door
    add(new THREE.CylinderGeometry(0.3, 0.2, 0.16, 28), new THREE.MeshStandardMaterial({ color: BONE, roughness: 0.3 }), 0, 0.5, 0.2)
    this.flowers(0, 0.56, 0.2, 0.7)
    this.obstacles.push({ x: 0, z: 0.2, r: 1.25 })

    // fitting room in the front-left corner: brass rail, green velvet curtain
    const curtain = new THREE.PlaneGeometry(1.5, 2.3, 30, 1)
    const cp = curtain.getAttribute("position") as THREE.BufferAttribute
    for (let i = 0; i < cp.count; i++) cp.setZ(i, Math.sin(cp.getX(i) * 18) * 0.04)
    curtain.computeVertexNormals()
    this.curtain = add(curtain, new THREE.MeshStandardMaterial({ color: 0x2c5a3c, roughness: 0.95, side: THREE.DoubleSide }), -W / 2 + 1.2, 1.2, D / 2 - 1.9, Math.PI / 2)
    add(new THREE.CylinderGeometry(0.015, 0.015, 1.6, 8), brass, -W / 2 + 1.2, 2.38, D / 2 - 1.9).rotation.x = Math.PI / 2
    const fit = textTexture("ဝတ်ကြည့်ခန်း · Fitting", '500 "Noto Sans Myanmar", "Inter", sans-serif', "#1A1611", null, 512, 80, 30)
    add(new THREE.PlaneGeometry(0.9, 0.14), new THREE.MeshBasicMaterial({ map: fit, transparent: true }), -W / 2 + 1.21, 2.6, D / 2 - 1.9, Math.PI / 2)
    this.obstacles.push({ x: -W / 2 + 0.7, z: D / 2 - 1.9, r: 0.8 })
    // full-length mirror in the front-right corner
    add(new RoundedBoxGeometry(0.9, 2.0, 0.05, 2, 0.02), brass, W / 2 - 0.05, 1.1, D / 2 - 1.9, -Math.PI / 2)
    add(new THREE.PlaneGeometry(0.8, 1.9), new THREE.MeshStandardMaterial({ color: 0xdfe6e6, metalness: 1, roughness: 0.05, envMapIntensity: 1.2 }), W / 2 - 0.08, 1.1, D / 2 - 1.9, -Math.PI / 2)
    // plants by the door
    for (const sx of [-1, 1]) {
      add(new THREE.CylinderGeometry(0.26, 0.2, 0.55, 20), new THREE.MeshStandardMaterial({ color: BONE, roughness: 0.4 }), sx * 1.7, 0.275, D / 2 - 0.5)
      this.leaves(sx * 1.7, 0.55, D / 2 - 0.5)
      this.obstacles.push({ x: sx * 1.7, z: D / 2 - 0.5, r: 0.45 })
    }
    // three brass globe pendants down the middle of the room
    for (const [x, z] of [[-2.8, -1.4], [2.8, -1.4], [-2.8, 1.8], [2.8, 1.8]]) {
      add(new THREE.CylinderGeometry(0.004, 0.004, 0.9, 4), brass, x, H - 0.45, z)
      add(new THREE.CylinderGeometry(0.04, 0.06, 0.07, 16), brass, x, H - 0.92, z)
      add(new THREE.SphereGeometry(0.15, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffe9d2 }), x, H - 1.1, z)
      const halo = add(new THREE.SphereGeometry(0.24, 20, 14), new THREE.MeshBasicMaterial({ color: 0x2a1c0e, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), x, H - 1.1, z)
      halo.renderOrder = 4
    }
    // coffered ceiling: green beams on bone
    for (let x = -W / 2 + 2; x < W / 2; x += 2) add(new THREE.BoxGeometry(0.14, 0.16, D), wains, x, H - 0.08, 0)
    for (let z = -D / 2 + 2; z < D / 2; z += 2) add(new THREE.BoxGeometry(W, 0.16, 0.14), wains, 0, H - 0.08, z)
    return floor
  }

  private flowers(x: number, y: number, z: number, s: number) {
    const stem = new THREE.MeshStandardMaterial({ color: 0x4f6b3c, roughness: 0.9 })
    const cols = [0xf2a7b8, 0xe98aa0, 0xfbd0d8, 0xf5f0ea]
    const r = seeded(x * 13 + z * 7 + 3)
    for (let k = 0; k < 14 * s; k++) {
      const a = r() * Math.PI * 2, d = r() * 0.14 * s, h = (0.35 + r() * 0.35) * s
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, h, 4), stem)
      st.position.set(x + Math.cos(a) * d * 0.5, y + h / 2, z + Math.sin(a) * d * 0.5)
      st.rotation.set(Math.sin(a) * 0.25, 0, Math.cos(a) * 0.25)
      this.scene.add(st)
      const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.045 * (0.7 + r() * 0.6) * Math.max(0.7, s), 10, 8), new THREE.MeshStandardMaterial({ color: cols[k % 4], roughness: 0.9 }))
      bloom.position.set(x + Math.cos(a) * d, y + h, z + Math.sin(a) * d)
      this.scene.add(bloom)
    }
  }

  private leaves(x: number, y: number, z: number) {
    const r = seeded(x * 31 + 5)
    const mat = new THREE.MeshStandardMaterial({ color: 0x4d7048, roughness: 0.85, side: THREE.DoubleSide })
    for (let k = 0; k < 16; k++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), mat)
      leaf.scale.set(0.35, 1, 0.12)
      const a = r() * Math.PI * 2
      leaf.position.set(x + Math.cos(a) * 0.12, y + 0.35 + r() * 0.6, z + Math.sin(a) * 0.12)
      leaf.rotation.set(Math.cos(a) * 0.7, a, Math.sin(a) * 0.7)
      this.scene.add(leaf)
    }
  }

  /**
   * Two rows of frames on three walls (64 places), hung column by column: the eye-level frame,
   * then the one above it. Back wall first (it faces the door), then left, then right, so a run
   * of one category stays together on one stretch of wall under its sign.
   */
  private buildSlots(): Slot[] {
    const cols: { x: number; z: number; n: THREE.Vector3 }[] = []
    for (const x of [-2.4, -3.3, -4.2, -5.1]) cols.push({ x, z: -D / 2 + 0.06, n: new THREE.Vector3(0, 0, 1) })
    for (let z = -D / 2 + 1.0; z <= D / 2 - 3.0; z += 0.86) cols.push({ x: -W / 2 + 0.06, z, n: new THREE.Vector3(1, 0, 0) })
    for (const x of [2.4, 3.3, 4.2, 5.1]) cols.push({ x, z: -D / 2 + 0.06, n: new THREE.Vector3(0, 0, 1) })
    for (let z = -D / 2 + 1.0; z <= D / 2 - 3.0; z += 0.86) cols.push({ x: W / 2 - 0.06, z, n: new THREE.Vector3(-1, 0, 0) })
    return cols.flatMap((c) => [1.3, 2.3].map((y) => ({ pos: new THREE.Vector3(c.x, y, c.z), normal: c.n })))
  }

  // ------------------------------------------------------------------ movement

  private clampInside(p: THREE.Vector3) {
    const m = 0.55
    p.x = THREE.MathUtils.clamp(p.x, -W / 2 + m, W / 2 - m)
    p.z = THREE.MathUtils.clamp(p.z, -D / 2 + m, D / 2 - 0.4)
    for (const o of this.obstacles) {
      let dx = p.x - o.x, dz = p.z - o.z
      if (Math.hypot(dx, dz) < 1e-3) dz = 1e-3        // dead centre: step out toward the door
      const d = Math.hypot(dx, dz)
      if (d < o.r + 0.3) {
        const k = (o.r + 0.3) / Math.max(d, 1e-4)
        p.x = o.x + dx * k
        p.z = o.z + dz * k
      }
    }
    return p
  }

  private glideTo(to: THREE.Vector3, yaw1 = this.yaw, pitch1 = this.pitch, dur = 0.8) {
    let dy = yaw1 - this.yaw
    dy = Math.atan2(Math.sin(dy), Math.cos(dy))
    this.glide = { from: this.pos.clone(), to, yaw0: this.yaw, yaw1: this.yaw + dy, p0: this.pitch, p1: pitch1, t: 0, dur }
    this.dirty = true
  }

  private onKey = (e: KeyboardEvent) => {
    const k = e.code
    if (!["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(k)) return
    if ((e.target as HTMLElement)?.closest?.("input, textarea")) return
    if (e.type === "keydown") this.keys.add(k)
    else this.keys.delete(k)
    this.dirty = true
  }

  private bindPointer() {
    const c = this.canvas
    let down: { x: number; y: number; t: number; yaw: number; pitch: number; id: number } | null = null
    let moved = false
    c.style.touchAction = "none"
    c.addEventListener("pointerdown", (e) => {
      try { c.setPointerCapture(e.pointerId) } catch { /* pointer already gone */ }
      down = { x: e.clientX, y: e.clientY, t: performance.now(), yaw: this.yaw, pitch: this.pitch, id: e.pointerId }
      moved = false
    })
    c.addEventListener("pointermove", (e) => {
      if (!down || e.pointerId !== down.id) { this.hover(e); return }
      const dx = e.clientX - down.x, dy = e.clientY - down.y
      if (!moved && Math.hypot(dx, dy) > 6) moved = true
      if (!moved) return
      this.glide = null
      const k = e.pointerType === "touch" ? 0.006 : 0.004
      this.yaw = down.yaw + dx * k
      this.pitch = THREE.MathUtils.clamp(down.pitch + dy * k * 0.8, -0.7, 0.55)
      this.dirty = true
    })
    const up = (e: PointerEvent) => {
      if (!down || e.pointerId !== down.id) return
      const tap = !moved && performance.now() - down.t < 500
      down = null
      if (tap) this.tap(e.clientX, e.clientY)
    }
    c.addEventListener("pointerup", up)
    c.addEventListener("pointercancel", () => { down = null })
  }

  private ray(x: number, y: number) {
    const r = this.canvas.getBoundingClientRect()
    const rc = new THREE.Raycaster()
    rc.setFromCamera(new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1), this.camera)
    return rc
  }

  private hover(e: PointerEvent) {
    if (e.pointerType !== "mouse") return
    const hit = this.ray(e.clientX, e.clientY).intersectObjects([...this.pickables, this.counter, this.curtain], false)[0]
    this.hoverEl.style.cursor = hit ? "pointer" : "grab"
  }

  private tap(x: number, y: number) {
    const rc = this.ray(x, y)
    const hits = rc.intersectObjects([...this.pickables, this.floor, this.counter, this.curtain], false)
    const h = hits[0]
    if (!h) return
    if (h.object === this.counter) { this.ev.onCounter(); return }
    if (h.object === this.curtain) { this.ev.onFitting(); return }
    if (h.object !== this.floor) { this.select(h.object.userData.index as number); return }
    // walk to the tapped spot (keep looking the same way unless it is behind the shoulder)
    const to = this.clampInside(h.point.clone().setY(EYE))
    const d = to.clone().sub(this.pos)
    const yaw = Math.atan2(-d.x, -d.z)
    let turn = yaw - this.yaw
    turn = Math.atan2(Math.sin(turn), Math.cos(turn))
    if (this.selected !== null) { this.selected = null; this.ev.onSelect(null) }
    this.glideTo(to, Math.abs(turn) > 0.9 ? yaw : this.yaw, Math.min(this.pitch, 0.05), Math.min(2.2, 0.35 + d.length() / 2.2))
  }

  // ------------------------------------------------------------------ frame

  private resize = () => {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / Math.max(1, h)
    // phones held upright need a wider view to see a wall
    this.camera.fov = this.camera.aspect < 0.8 ? 78 : 62
    this.camera.updateProjectionMatrix()
    this.dirty = true
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    const now = performance.now()
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now
    if (this.glide) {
      const g = this.glide
      g.t += dt
      const k = Math.min(1, g.t / g.dur), e = k * k * (3 - 2 * k)
      this.pos.lerpVectors(g.from, g.to, e)
      this.yaw = g.yaw0 + (g.yaw1 - g.yaw0) * e
      this.pitch = g.p0 + (g.p1 - g.p0) * e
      if (k >= 1) this.glide = null
      this.dirty = true
    }
    if (this.keys.size) {
      const f = (this.keys.has("KeyW") || this.keys.has("ArrowUp") ? 1 : 0) - (this.keys.has("KeyS") || this.keys.has("ArrowDown") ? 1 : 0)
      const s = (this.keys.has("KeyD") ? 1 : 0) - (this.keys.has("KeyA") ? 1 : 0)
      const turn = (this.keys.has("ArrowLeft") ? 1 : 0) - (this.keys.has("ArrowRight") ? 1 : 0)
      this.yaw += turn * dt * 1.8
      const fwd = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw))
      const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw))
      this.pos.addScaledVector(fwd, f * dt * 1.9).addScaledVector(right, s * dt * 1.6)
      this.clampInside(this.pos)
      this.glide = null
      this.dirty = true
    }
    if (this.girl && this.girlBob > 0) {
      this.girlBob = Math.max(0, this.girlBob - dt)
      this.girl.position.y = 0.02 + Math.sin((0.25 - this.girlBob) / 0.25 * Math.PI) * 0.03
      this.dirty = true
    }
    if (!this.dirty) return
    this.dirty = false
    this.camera.position.copy(this.pos)
    this.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ")
    this.renderer.render(this.scene, this.camera)
  }
}

// ------------------------------------------------------------------ textures

function seeded(seed: number) {
  let s = Math.floor(Math.abs(seed) * 1000) % 2147483646 + 1
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

/** Crop a photo to the frame's aspect (like CSS object-fit: cover). */
function coverFit(tex: THREE.Texture, aspect: number) {
  const img = tex.image as { width: number; height: number }
  const a = img.width / img.height
  if (a > aspect) { tex.repeat.set(aspect / a, 1); tex.offset.set((1 - aspect / a) / 2, 0) }
  else { tex.repeat.set(1, a / aspect); tex.offset.set(0, (1 - a / aspect) / 2) }
}

function plankTexture() {
  const S = 512, N = 6, B = S / N
  const c = document.createElement("canvas")
  c.width = c.height = S
  const g = c.getContext("2d")!
  const r = seeded(41)
  for (let i = 0; i < N; i++) {
    const off = r() * S
    for (let k = -1; k < 3; k++) {
      const tone = 0.93 + r() * 0.1
      g.fillStyle = `rgb(${Math.round(214 * tone)},${Math.round(184 * tone)},${Math.round(150 * tone)})`
      g.fillRect(i * B, off + k * (S / 2.2), B, S / 2.2)
      g.fillRect(i * B, off + k * (S / 2.2) - S, B, S / 2.2)
    }
    g.save(); g.beginPath(); g.rect(i * B, 0, B, S); g.clip()
    for (let l = 0; l < 14; l++) {
      g.strokeStyle = `rgba(140,100,70,${0.05 + r() * 0.08})`
      g.lineWidth = 0.6 + r() * 1.4
      const x = i * B + r() * B
      g.beginPath(); g.moveTo(x, 0)
      for (let y = 0; y <= S; y += 64) g.lineTo(x + Math.sin(y * 0.02 + l) * 3, y)
      g.stroke()
    }
    g.restore()
    g.fillStyle = "rgba(90,62,40,0.45)"
    g.fillRect(i * B, 0, 1.5, S)
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function textTexture(text: string, font: string, fill: string, glow: string | null, w = 1024, h = 400, size = 250) {
  const c = document.createElement("canvas")
  c.width = w; c.height = h
  const g = c.getContext("2d")!
  const m = font.match(/^(\d{3})\s+(.*)$/)   // optional leading weight, then the family list
  g.font = `${m ? m[1] : "400"} ${size}px ${m ? m[2] : font}`
  g.textAlign = "center"; g.textBaseline = "middle"
  if (glow) { g.shadowColor = glow; g.shadowBlur = 38 }
  g.fillStyle = fill
  g.fillText(text, w / 2, h / 2 + size * 0.05)
  if (glow) { g.shadowBlur = 12; g.fillText(text, w / 2, h / 2 + size * 0.05) }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function placeholderTexture(category: string) {
  const c = document.createElement("canvas")
  c.width = 300; c.height = 400
  const g = c.getContext("2d")!
  const grd = g.createLinearGradient(0, 0, 0, 400)
  grd.addColorStop(0, "#f6e1e1"); grd.addColorStop(1, "#dbe7d9")
  g.fillStyle = grd; g.fillRect(0, 0, 300, 400)
  g.fillStyle = "#2f4a36"; g.textAlign = "center"; g.textBaseline = "middle"
  g.font = '400 84px "Kaushan Script", cursive'
  g.fillText("Sinar", 150, 180)
  g.font = '500 20px "Inter", sans-serif'
  g.fillText(category.toUpperCase().split("").join(" "), 150, 250)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** All hang tags in one texture: 4 x 16 slots of 256 x 96. */
function tagAtlas(items: BoutiqueItem[]) {
  const c = document.createElement("canvas")
  c.width = 1024; c.height = 1536
  const g = c.getContext("2d")!
  items.forEach((it, i) => {
    const x = (i % 4) * 256, y = Math.floor(i / 4) * 96
    g.fillStyle = "#F7F1E8"
    g.beginPath(); g.roundRect(x + 6, y + 6, 244, 84, 10); g.fill()
    g.fillStyle = "#b99a62"; g.beginPath(); g.arc(x + 26, y + 48, 7, 0, Math.PI * 2); g.fill()
    const flag = it.onSale ? "SALE" : it.badge ? it.badge.toUpperCase().slice(0, 10) : ""
    g.fillStyle = "#1A1611"; g.textBaseline = "middle"; g.textAlign = "left"
    g.font = '700 34px "Inter", sans-serif'
    g.fillText(`${it.price.toLocaleString("en-US")} Ks`, x + 44, y + (flag ? 36 : 48))
    if (flag) {
      g.fillStyle = it.onSale ? "#c23a4a" : "#2f4a36"
      g.font = '700 20px "Inter", sans-serif'
      g.fillText(flag, x + 44, y + 70)
    }
  })
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return { tex, uv: (i: number) => new THREE.Vector4(((i % 4) * 256) / 1024, 1 - ((Math.floor(i / 4) + 1) * 96) / 1536, ((i % 4) * 256 + 256) / 1024, 1 - (Math.floor(i / 4) * 96) / 1536) }
}

function tagPlane(w: number, h: number, slot: THREE.Vector4) {
  const geo = new THREE.PlaneGeometry(w, h)
  const uv = geo.getAttribute("uv") as THREE.BufferAttribute
  for (let i = 0; i < uv.count; i++) uv.setXY(i, slot.x + uv.getX(i) * (slot.z - slot.x), slot.y + uv.getY(i) * (slot.w - slot.y))
  return geo
}

function signTexture(en: string, mm: string) {
  const c = document.createElement("canvas")
  c.width = 512; c.height = 176
  const g = c.getContext("2d")!
  g.fillStyle = "#1A1611"; g.textAlign = "center"; g.textBaseline = "middle"
  g.font = '600 64px "Playfair Display", Georgia, serif'
  g.fillText(en, 256, mm ? 64 : 88)
  if (mm) { g.font = '500 44px "Noto Sans Myanmar", sans-serif'; g.fillText(mm, 256, 132) }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((res) => {
    const img = new Image()
    img.onload = () => res(img.naturalWidth > 0 ? img : null)
    img.onerror = () => res(null)
    img.src = src
  })
}

/**
 * Solid-blue background -> transparent. Blueness = b - max(r, g): clear blue goes, a soft band
 * feathers the edge, and blue spill on hair and skin is pulled back to neutral.
 */
function keyBlue(img: HTMLImageElement) {
  const max = 1024
  const k = Math.min(1, max / Math.max(img.width, img.height))
  const c = document.createElement("canvas")
  c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
  const g = c.getContext("2d", { willReadFrequently: true })!
  g.drawImage(img, 0, 0, c.width, c.height)
  const d = g.getImageData(0, 0, c.width, c.height)
  const px = d.data
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], gg = px[i + 1], b = px[i + 2]
    const blue = b - Math.max(r, gg)
    if (blue > 30) {
      const a = Math.max(0, Math.min(1, 1 - (blue - 30) / 90))
      px[i + 3] = Math.round(px[i + 3] * a)
      px[i + 2] = Math.max(r, gg)          // despill
    }
  }
  g.putImageData(d, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** Soft round falloff for light washes. */
function radialTexture() {
  const c = document.createElement("canvas")
  c.width = c.height = 128
  const g = c.getContext("2d")!
  const grd = g.createRadialGradient(64, 50, 4, 64, 64, 64)
  grd.addColorStop(0, "rgba(255,255,255,1)")
  grd.addColorStop(0.5, "rgba(255,255,255,0.35)")
  grd.addColorStop(1, "rgba(255,255,255,0)")
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function labelTexture(text: string, bg: string, fg: string) {
  const c = document.createElement("canvas")
  c.width = 512; c.height = 106
  const g = c.getContext("2d")!
  g.fillStyle = bg; g.fillRect(0, 0, 512, 106)
  g.fillStyle = fg; g.font = '600 46px "Inter", sans-serif'
  g.textAlign = "center"; g.textBaseline = "middle"
  g.fillText(text.split("").join(" "), 256, 56)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
