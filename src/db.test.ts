import { describe, expect, it } from 'vitest';
import { importState } from './db';

const validBackup = () => ({
  updatedAt: '2026-08-28T12:00:00.000Z',
  jobs: [{
    id: 'job-1', name: 'Pump room', site: 'Riverside Court', status: 'open', createdAt: '2026-08-28T08:00:00.000Z',
    lines: [{ id: 'line-1', code: 'VAL-22', name: 'Isolation valve', quantity: 6, used: 2, origin: 'Main stores · Bin B4' }],
  }],
  movements: [{ id: 'move-1', at: '2026-08-28T08:01:00.000Z', jobId: 'job-1', jobName: 'Pump room', itemCode: 'VAL-22', itemName: 'Isolation valve', quantity: 6, kind: 'out', from: 'Main stores · Bin B4', to: 'Riverside Court' }],
});

describe('importState', () => {
  it('accepts a complete Stock Return Trail backup', async () => {
    await expect(importState(validBackup())).resolves.toMatchObject({ jobs: [{ name: 'Pump room' }], movements: [{ kind: 'out' }] });
  });

  it('rejects a structurally incomplete backup before it can replace local records', async () => {
    await expect(importState({ jobs: [{}], movements: [], updatedAt: '2026-08-28T12:00:00.000Z' })).rejects.toThrow('invalid job 1');
  });

  it('rejects blank provenance fields in a backup', async () => {
    const backup = validBackup();
    backup.jobs[0].lines[0].origin = '   ';
    await expect(importState(backup)).rejects.toThrow('blank or missing origin');
  });
});
