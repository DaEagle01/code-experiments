import { openDB } from "../db/indexedDB";
import type { Medicine } from "../models/Medicine";

const STORE_NAME = "medicines";

async function withStore<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => void
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    callback(store);

    tx.oncomplete = () => resolve(undefined as unknown as T);
    tx.onerror = () => reject(tx.error);
  });
}

export const MedicineStore = {
  async add(med: Medicine) {
    return withStore("readwrite", (store) => store.add(med));
  },

  async getAll(): Promise<Medicine[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async update(med: Medicine) {
    return withStore("readwrite", (store) => store.put(med));
  },

  async delete(id: string) {
    return withStore("readwrite", (store) => store.delete(id));
  },

  async searchByName(name: string): Promise<Medicine[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const index = store.index("name");
      const request = index.getAll(IDBKeyRange.only(name));

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
};
