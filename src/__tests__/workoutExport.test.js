import { describe, it, expect } from 'vitest';
import { exportToPDF, exportToExcel, exportToWord } from '../utils/workoutExport';

describe('workoutExport validation', () => {
  it('exportToPDF throws on null workout', async () => {
    await expect(exportToPDF(null)).rejects.toThrow('Invalid workout data');
  });

  it('exportToPDF throws on missing title', async () => {
    await expect(exportToPDF({ blocks: [] })).rejects.toThrow('Invalid workout data');
  });

  it('exportToPDF throws on missing blocks', async () => {
    await expect(exportToPDF({ title: 'Test' })).rejects.toThrow('Invalid workout data');
  });

  it('exportToPDF throws on non-array blocks', async () => {
    await expect(exportToPDF({ title: 'Test', blocks: 'not-array' })).rejects.toThrow('Invalid workout data');
  });

  it('exportToExcel throws on invalid workout', async () => {
    await expect(exportToExcel(null)).rejects.toThrow('Invalid workout data');
  });

  it('exportToWord throws on invalid workout', async () => {
    await expect(exportToWord(null)).rejects.toThrow('Invalid workout data');
  });
});
