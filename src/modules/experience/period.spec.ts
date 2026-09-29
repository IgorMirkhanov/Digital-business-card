import { buildPeriod } from './period';

describe('buildPeriod', () => {
  it('describes a finished period with inclusive month count', () => {
    const period = buildPeriod(new Date('2023-01-01'), new Date('2024-06-30'));

    expect(period).toMatchObject({ isCurrent: false, durationMonths: 18, label: 'Jan 2023 – Jun 2024' });
  });

  it('treats a missing end date as the current job counted up to now', () => {
    const period = buildPeriod(new Date('2026-03-01'), null, new Date('2026-09-15'));

    expect(period).toMatchObject({ isCurrent: true, endDate: null, durationMonths: 7, label: 'Mar 2026 – present' });
  });

  it('counts at least one month', () => {
    expect(buildPeriod(new Date('2026-09-10'), new Date('2026-09-20')).durationMonths).toBe(1);
  });
});
