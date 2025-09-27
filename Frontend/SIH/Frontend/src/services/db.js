import { openDB } from 'idb';

const DB_NAME = 'citizen-connect-db';
const STORE_NAME = 'pending-reports';
const TOKEN_STORE = 'auth-token-store';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains(TOKEN_STORE)) {
      db.createObjectStore(TOKEN_STORE, { keyPath: 'id' });
    }
  },
});

export async function saveReportOffline(reportData) {
  const db = await dbPromise;
  await db.add(STORE_NAME, reportData);
}

export async function getAllPendingReports() {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME);
}

export async function deletePendingReport(id) {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
}

/**
 * Saves the authentication token to IndexedDB.
 */
export async function saveTokenToDB(token) {
  const db = await dbPromise;
  // We use a fixed key 'authToken' so we can easily retrieve it
  await db.put(TOKEN_STORE, { id: 'authToken', value: token });
}

/**
 * Retrieves the authentication token from IndexedDB.
 */
export async function getTokenFromDB() {
  const db = await dbPromise;
  const tokenObj = await db.get(TOKEN_STORE, 'authToken');
  return tokenObj ? tokenObj.value : null;
}