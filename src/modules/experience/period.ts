import { Period } from './models/period.model';

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Pure domain logic: derives display values of an employment period. */
export function buildPeriod(startDate: Date, endDate: Date | null, now: Date = new Date()): Period {
  const effectiveEnd = endDate ?? now;
  const durationMonths =
    (effectiveEnd.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
    (effectiveEnd.getUTCMonth() - startDate.getUTCMonth()) +
    1;

  return {
    startDate,
    endDate,
    isCurrent: endDate === null,
    durationMonths: Math.max(durationMonths, 1),
    label: `${monthFormatter.format(startDate)} – ${endDate ? monthFormatter.format(endDate) : 'present'}`,
  };
}
