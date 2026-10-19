const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const isValidDateInput = (value: string): boolean => {
	const match = DATE_INPUT_PATTERN.exec(value);
	if (!match) return false;

	const [, year, month, day] = match;
	const date = new Date(Number(year), Number(month) - 1, Number(day));

	return (
		date.getFullYear() === Number(year) &&
		date.getMonth() === Number(month) - 1 &&
		date.getDate() === Number(day)
	);
};

export const parseDateInput = (value: string): Date => {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
};

export const toDateInputValue = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const normalizeDateInput = (value: string | Date | undefined): string | undefined => {
	if (!value) return undefined;
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? undefined : toDateInputValue(value);
	}

	const dateOnly = value.slice(0, 10);
	if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
		return isValidDateInput(dateOnly) ? dateOnly : undefined;
	}

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? undefined : toDateInputValue(parsed);
};

export const clampDate = (date: Date, min?: Date, max?: Date): Date => {
	if (min && date < min) return min;
	if (max && date > max) return max;
	return date;
};

export const isSameDay = (a: Date, b: Date): boolean => {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
};

export const getStartOfToday = (): Date => {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const formatDisplayDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${day}.${month}.${year}`;
};
