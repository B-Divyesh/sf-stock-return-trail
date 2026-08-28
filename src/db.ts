import type { AppState } from './types';

const STORE = 'state';
const KEY = 'workspace';

const emptyState = (): AppState => ({ jobs: [], movements: [], updatedAt: new Date().toISOString() });

const sampleState = (): AppState => {
  const createdAt = '2026-08-28T07:45:00.000Z';
  const jobId = 'job-riverside-pump';
  const lines = [
    { id: 'line-valve', code: 'VAL-22', name: '22 mm isolation valve', quantity: 6, used: 2, origin: 'Main stores · Bin B4' },
    { id: 'line-cable', code: 'CBL-3C', name: '3-core flex · 10 m', quantity: 4, used: 1, origin: 'Workshop · Cable rack' },
    { id: 'line-clips', code: 'CLP-20', name: '20 mm pipe clips', quantity: 24, used: 18, origin: 'Main stores · Bin A7' },
  ];
  return {
    jobs: [{ id: jobId, name: 'Riverside pump room', site: 'Riverside Court · Plant room', status: 'open', createdAt, lines }],
    movements: lines.map((line, index) => ({
      id: `move-out-${index}`,
      at: new Date(Date.parse(createdAt) + index * 60_000).toISOString(),
      jobId,
      jobName: 'Riverside pump room',
      itemCode: line.code,
      itemName: line.name,
      quantity: line.quantity,
      kind: 'out' as const,
      from: line.origin,
      to: 'Riverside Court · Plant room',
    })),
    updatedAt: createdAt,
  };
};

function databaseName(demo: boolean) {
  return demo ? 'stock-return-trail:demo' : 'stock-return-trail:real';
}

function openDb(demo: boolean): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName(demo), 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadState(demo: boolean): Promise<AppState> {
  const db = await openDb(demo);
  const value = await new Promise<AppState | undefined>((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).get(KEY);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  if (value) return value;
  const initial = demo ? sampleState() : emptyState();
  await saveState(demo, initial);
  return initial;
}

export async function saveState(demo: boolean, state: AppState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  const db = await openDb(demo);
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(state, KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
}

export async function resetDemo(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(databaseName(true));
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

export async function importState(value: unknown): Promise<AppState> {
  if (!value || typeof value !== 'object') throw new Error('The file does not contain a Stock Return Trail backup.');
  const state = value as AppState;
  if (!Array.isArray(state.jobs) || !Array.isArray(state.movements)) throw new Error('The backup is missing jobs or movements.');
  return state;
}
