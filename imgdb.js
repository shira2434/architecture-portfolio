// imgdb.js — IndexedDB wrapper for project images
const ImgDB = (() => {
  const DB_NAME = 'studioImgDB';
  const STORE = 'images';
  let db = null;

  function open() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = e => e.target.result.createObjectStore(STORE);
      req.onsuccess = e => { db = e.target.result; resolve(db); };
      req.onerror = () => reject(req.error);
    });
  }

  function save(key, dataUrl) {
    return open().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(dataUrl, key);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    }));
  }

  function load(key) {
    return open().then(db => new Promise((resolve, reject) => {
      const req = db.transaction(STORE).objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    }));
  }

  function remove(key) {
    return open().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    }));
  }

  function loadAll() {
    return open().then(db => new Promise((resolve, reject) => {
      const result = {};
      const tx = db.transaction(STORE);
      const req = tx.objectStore(STORE).openCursor();
      req.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) { result[cursor.key] = cursor.value; cursor.continue(); }
        else resolve(result);
      };
      req.onerror = () => reject(req.error);
    }));
  }

  return { save, load, remove, loadAll };
})();
