import { openDB } from "../db/indexedDB";
import type { Medicine } from "../models/Medicine";

const STORE_NAME = "medicines";

async function withStore<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
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

  async deleteExpired(): Promise<number> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();
    const now = new Date();

    return new Promise((resolve, reject) => {
      let deleted = 0;

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const med = cursor.value as Medicine;
          if (new Date(med.expiryDate) < now) {
            cursor.delete();
            deleted++;
          }
          cursor.continue();
        } else {
          resolve(deleted);
        }
      };

      request.onerror = () => reject(request.error);
    });
  },

  async searchByName(term: string): Promise<Medicine[]> {
    const db = await openDB();
    const results: Medicine[] = [];

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const index = store.index("name");
      const request = index.openCursor();

      const lowerTerm = term.toLowerCase();

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const value = cursor.value as Medicine;
          if (value.name.toLowerCase().includes(lowerTerm)) {
            results.push(value);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  },

  async exportAll(): Promise<Blob> {
    const all = await this.getAll();
    const blob = new Blob([JSON.stringify(all, null, 2)], {
      type: "application/json",
    });
    return blob;
  },

  async importFromJSON(json: string): Promise<number> {
    const parsed: Medicine[] = JSON.parse(json);
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    let imported = 0;

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(imported);
      tx.onerror = () => reject(tx.error);

      parsed.forEach((item) => {
        store.put(item); // overwrite if exists
        imported++;
      });
    });
  },

  async getPaginated(offset: number, limit: number): Promise<Medicine[]> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();
    const result: Medicine[] = [];
    let skipped = 0;

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return resolve(result);

        if (skipped < offset) {
          skipped++;
          cursor.continue();
          return;
        }

        if (result.length < limit) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };

      request.onerror = () => reject(request.error);
    });
  },
};
