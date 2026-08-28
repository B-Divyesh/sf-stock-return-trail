export type MovementKind = 'out' | 'return' | 'used';

export interface StockLine {
  id: string;
  code: string;
  name: string;
  quantity: number;
  used: number;
  origin: string;
}

export interface Job {
  id: string;
  name: string;
  site: string;
  status: 'open' | 'closed';
  createdAt: string;
  closedAt?: string;
  lines: StockLine[];
}

export interface Movement {
  id: string;
  at: string;
  jobId: string;
  jobName: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  kind: MovementKind;
  from: string;
  to: string;
}

export interface AppState {
  jobs: Job[];
  movements: Movement[];
  updatedAt: string;
}
