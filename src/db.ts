import type { AppState, Job, Movement, MovementKind, StockLine } from './types';

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
  if (!isRecord(value)) throw new Error('The file does not contain a Stock Return Trail backup.');
  if (!Array.isArray(value.jobs) || !Array.isArray(value.movements) || !isTimestamp(value.updatedAt)) {
    throw new Error('The backup is missing valid jobs, movements, or an export date.');
  }

  const jobs = value.jobs.map((job, index) => parseJob(job, index));
  const jobIds = new Set(jobs.map((job) => job.id));
  if (jobIds.size !== jobs.length) throw new Error('The backup contains duplicate job identifiers.');
  const lineIds = jobs.flatMap((job) => job.lines.map((line) => line.id));
  if (new Set(lineIds).size !== lineIds.length) throw new Error('The backup contains duplicate stock-line identifiers.');

  const movements = value.movements.map((movement, index) => parseMovement(movement, index, jobIds));
  if (new Set(movements.map((movement) => movement.id)).size !== movements.length) {
    throw new Error('The backup contains duplicate movement identifiers.');
  }
  return { jobs, movements, updatedAt: value.updatedAt };
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requiredText(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`The backup has a blank or missing ${label}.`);
  return value.trim();
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '' && Number.isFinite(Date.parse(value));
}

function requiredTimestamp(value: unknown, label: string): string {
  if (!isTimestamp(value)) throw new Error(`The backup has an invalid ${label}.`);
  return value;
}

function wholeNumber(value: unknown, label: string, minimum: number, maximum = 99999): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`The backup has an invalid ${label}.`);
  }
  return value;
}

function parseLine(value: unknown, jobIndex: number, lineIndex: number): StockLine {
  if (!isRecord(value)) throw new Error(`Job ${jobIndex + 1} has an invalid stock line ${lineIndex + 1}.`);
  const quantity = wholeNumber(value.quantity, `count on stock line ${lineIndex + 1}`, 1);
  const used = wholeNumber(value.used, `used count on stock line ${lineIndex + 1}`, 0, quantity);
  return {
    id: requiredText(value.id, `stock-line identifier ${lineIndex + 1}`),
    code: requiredText(value.code, `stock code on line ${lineIndex + 1}`),
    name: requiredText(value.name, `stock name on line ${lineIndex + 1}`),
    quantity,
    used,
    origin: requiredText(value.origin, `origin on stock line ${lineIndex + 1}`),
  };
}

function parseJob(value: unknown, index: number): Job {
  if (!isRecord(value) || !Array.isArray(value.lines)) throw new Error(`The backup has an invalid job ${index + 1}.`);
  if (value.status !== 'open' && value.status !== 'closed') throw new Error(`The backup has an invalid status on job ${index + 1}.`);
  const closedAt = value.closedAt === undefined ? undefined : requiredTimestamp(value.closedAt, `close date on job ${index + 1}`);
  if (value.status === 'closed' && !closedAt) throw new Error(`The backup is missing the close date on job ${index + 1}.`);
  return {
    id: requiredText(value.id, `job identifier ${index + 1}`),
    name: requiredText(value.name, `job name ${index + 1}`),
    site: requiredText(value.site, `job location ${index + 1}`),
    status: value.status,
    createdAt: requiredTimestamp(value.createdAt, `start date on job ${index + 1}`),
    ...(closedAt ? { closedAt } : {}),
    lines: value.lines.map((line, lineIndex) => parseLine(line, index, lineIndex)),
  };
}

function parseMovement(value: unknown, index: number, jobIds: Set<string>): Movement {
  if (!isRecord(value)) throw new Error(`The backup has an invalid movement ${index + 1}.`);
  const kind = value.kind;
  if (kind !== 'out' && kind !== 'used' && kind !== 'return') throw new Error(`The backup has an invalid movement type on movement ${index + 1}.`);
  const jobId = requiredText(value.jobId, `job identifier on movement ${index + 1}`);
  if (!jobIds.has(jobId)) throw new Error(`Movement ${index + 1} does not belong to a job in this backup.`);
  return {
    id: requiredText(value.id, `movement identifier ${index + 1}`),
    at: requiredTimestamp(value.at, `date on movement ${index + 1}`),
    jobId,
    jobName: requiredText(value.jobName, `job name on movement ${index + 1}`),
    itemCode: requiredText(value.itemCode, `stock code on movement ${index + 1}`),
    itemName: requiredText(value.itemName, `stock name on movement ${index + 1}`),
    quantity: wholeNumber(value.quantity, `count on movement ${index + 1}`, 1),
    kind: kind as MovementKind,
    from: requiredText(value.from, `origin on movement ${index + 1}`),
    to: requiredText(value.to, `destination on movement ${index + 1}`),
  };
}
