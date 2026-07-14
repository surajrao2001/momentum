const DB_NAME = 'momentum-offline';
const STORE = 'queue';

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
            req.result.createObjectStore(STORE, {
                keyPath: 'id',
                autoIncrement: true,
            });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function queueOfflineAction(
    url: string,
    method: string,
    body?: string
) {
    const db = await openDb();
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add({
        url,
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
        createdAt: Date.now(),
    });
}

export async function flushOfflineQueue() {
    const db = await openDb();
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const items = await new Promise<
        Array<{
            id: number;
            url: string;
            method: string;
            headers: Record<string, string>;
            body?: string;
        }>
    >((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });

    for (const item of items) {
        try {
            await fetch(item.url, {
                method: item.method,
                headers: item.headers,
                body: item.body,
            });
            store.delete(item.id);
        } catch {
            break;
        }
    }
}
