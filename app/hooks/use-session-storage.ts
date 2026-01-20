import type { HistoryMessage, Round } from '@/store/orchestration';
import { useCallback, useEffect, useState } from 'react';

const DB_NAME = 'nexus-sessions';
const STORE_NAME = 'sessions';
const DB_VERSION = 3;

export interface Session {
  id: string;
  title: string;
  history: HistoryMessage[];
  rounds: Round[];
  createdAt: number;
  updatedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
  });

  return dbPromise;
};

const normalizeSession = (data: Partial<Session>): Session => ({
  id: data.id || '',
  title: data.title || 'Untitled',
  history: data.history || [],
  rounds: data.rounds || [],
  createdAt: data.createdAt || Date.now(),
  updatedAt: data.updatedAt || Date.now(),
});

export const useSessionStorage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('updatedAt');

    return new Promise<Session[]>((resolve) => {
      const request = index.openCursor(null, 'prev');
      const results: Session[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          results.push(normalizeSession(cursor.value));
          cursor.continue();
        } else {
          resolve(results);
        }
      };
    });
  }, []);

  const saveSession = useCallback(async (session: Session) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(session);

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => {
        setSessions((prev) => {
          const idx = prev.findIndex((s) => s.id === session.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = session;
            return updated.sort((a, b) => b.updatedAt - a.updatedAt);
          }
          return [session, ...prev];
        });
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  }, []);

  const getSession = useCallback(async (id: string): Promise<Session | undefined> => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const data = request.result;
        resolve(data ? normalizeSession(data) : undefined);
      };
    });
  }, []);

  useEffect(() => {
    loadSessions().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, [loadSessions]);

  return { sessions, loading, saveSession, deleteSession, getSession, refresh: loadSessions };
};

export const generateSessionId = () => crypto.randomUUID();

export const generateSessionTitle = (query: string) =>
  query.length > 30 ? query.slice(0, 30) + '...' : query;
