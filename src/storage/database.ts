export class Database<TValue = unknown> {
  constructor(
    private readonly dbName: string,
    private readonly storeName: string,
  ) {}

  async open() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const openRequest = indexedDB.open(this.dbName, 1);

      openRequest.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      openRequest.onsuccess = () => {
        resolve(openRequest.result);
      };

      openRequest.onerror = () => {
        reject(openRequest.error);
      };
    });
  }

  async save(key: IDBValidKey, value: TValue) {
    const db = await this.open();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise<IDBValidKey>((resolve, reject) => {
      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async get(key: IDBValidKey) {
    const db = await this.open();
    const transaction = db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);

    return new Promise<TValue | undefined>((resolve, reject) => {
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result as TValue | undefined);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
