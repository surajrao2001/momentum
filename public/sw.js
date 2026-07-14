const CACHE_NAME = "momentum-v1";
const OFFLINE_QUEUE = "momentum-offline-queue";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/", "/today", "/manifest.json"]),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response.ok && event.request.url.includes("/today")) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    }),
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === OFFLINE_QUEUE) {
    event.waitUntil(flushOfflineQueue());
  }
});

async function flushOfflineQueue() {
  const db = await openDB();
  const tx = db.transaction("queue", "readwrite");
  const store = tx.objectStore("queue");
  const items = await store.getAll();
  for (const item of items) {
    try {
      await fetch(item.url, { method: item.method, headers: item.headers, body: item.body });
      await store.delete(item.id);
    } catch {
      // retry on next sync
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("momentum-offline", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("queue", { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
