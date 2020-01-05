export default class BackupStore {
  constructor(storage) {
    this._storage = storage;
    this._storeKey = null;
  }
  
  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  setAppStoreData(value) {
    this._storage.setItem(this._storeKey, JSON.stringify(Object.assign({}, value)));
  }

  setPoint(key, value) {
    const store = this.getAll();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  setStoreKey(key) {
    this._storeKey = key;
  }

  removeItem(key) {
    const store = this.getAll();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }
}
