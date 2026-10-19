import { describe, expect, it } from 'vitest';
import {
	formatDisplayDate,
	isValidDateInput,
	normalizeDateInput,
	parseDateInput,
	toDateInputValue,
} from './date-helpers';

describe('date helpers', () => {
	it('validates calendar dates instead of only checking their shape', () => {
		expect(isValidDateInput('2026-02-18')).toBe(true);
		expect(isValidDateInput('2024-02-29')).toBe(true);
		expect(isValidDateInput('2026-02-29')).toBe(false);
		expect(isValidDateInput('2026-02-30')).toBe(false);
		expect(isValidDateInput('18.02.2026')).toBe(false);
	});

	it('preserves date-only values without timezone conversion', () => {
		expect(normalizeDateInput('2026-02-18')).toBe('2026-02-18');
		expect(normalizeDateInput('2026-02-18T23:30:00-05:00')).toBe('2026-02-18');
		expect(normalizeDateInput(new Date(2026, 1, 18, 12))).toBe('2026-02-18');
	});

	it('rejects malformed ISO dates instead of rolling them into another day', () => {
		expect(normalizeDateInput('2026-02-30')).toBeUndefined();
		expect(normalizeDateInput('2026-13-01T00:00:00Z')).toBeUndefined();
		expect(normalizeDateInput('not-a-date')).toBeUndefined();
	});

	it('formats local calendar dates consistently', () => {
		const date = parseDateInput('2026-02-18');

		expect(toDateInputValue(date)).toBe('2026-02-18');
		expect(formatDisplayDate(date)).toBe('18.02.2026');
	});
});
