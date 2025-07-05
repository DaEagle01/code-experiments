const DB_NAME = "MedicineDB";
const DB_VERSION = 1;
const STORE_NAME = "medicines";

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("company", "company", { unique: false });
        store.createIndex("expiryDate", "expiryDate", { unique: false });
        return;
      }

      const version = (event.target as IDBOpenDBRequest).result.version;

      if (version < 2) {
        const transaction = db.transaction(STORE_NAME, "versionchange");
        const store = transaction.objectStore(STORE_NAME);
        store.createIndex("taken", "taken", { unique: false });
      }

      if (version < 3) {
        const transaction = db.transaction(STORE_NAME, "versionchange");
        const store = transaction.objectStore(STORE_NAME);
        store.createIndex("bought", "bought", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
