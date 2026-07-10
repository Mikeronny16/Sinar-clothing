// Minimal stale-while-revalidate service worker for Sinar (PWA offline shell).
const CACHE = "sinar-v1"

self.addEventListener("install", () => self.skipWaiting())

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (e) => {
  const req = e.request
  if (req.method !== "GET") return
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req)
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok && new URL(req.url).origin === location.origin) cache.put(req, res.clone())
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
