'use client';

import { Button } from '@/shared/components/button';
import { Calendar } from '@/shared/components/calendar';
import { cn } from '@/shared/utils/classNames';
import { useEffect, useId, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import {
	clampDate,
	formatDisplayDate,
	getStartOfToday,
	normalizeDateInput,
	parseDateInput,
	toDateInputValue,
} from './date-helpers';

export type DateValue = string | undefined;

export interface DateRangeValue {
	from?: DateValue;
	to?: DateValue;
}

interface FilterDateRangeProps {
	from?: DateValue;
	to?: DateValue;
	min?: DateValue;
	max?: DateValue;
	onChange: (range: DateRangeValue) => void;
}

interface DatePreset {
	label: string;
	getRange: () => { from?: DateValue; to?: DateValue };
}

// --- UTC-safe helpers: treat YYYY-MM-DD as literal calendar date ---

export const FilterDateRange = ({ from, to, min, max, onChange }: FilterDateRangeProps) => {
	const normalizedFrom = normalizeDateInput(from);
	const normalizedTo = normalizeDateInput(to);
	const normalizedMin = normalizeDateInput(min);
	const normalizedMax = normalizeDateInput(max);
	const [draftRange, setDraftRange] = useState<DateRangeValue>({
		from: normalizedFrom,
		to: normalizedTo,
	});
	useEffect(() => {
		setDraftRange({ from: normalizedFrom, to: normalizedTo });
	}, [normalizedFrom, normalizedTo]);
	const inputId = useId();
	const minDate = useMemo(
		() => (normalizedMin ? parseDateInput(normalizedMin) : undefined),
		[normalizedMin],
	);
	const maxDate = useMemo(
		() => (normalizedMax ? parseDateInput(normalizedMax) : undefined),
		[normalizedMax],
	);

	const presets: DatePreset[] = useMemo(
		() => [
			{
				label: 'All time',
				getRange: () => ({ from: undefined, to: undefined }),
			},
			{
				label: 'Today',
				getRange: () => {
					const today = clampDate(getStartOfToday(), minDate, maxDate);
					const value = toDateInputValue(today);
					return { from: value, to: value };
				},
			},
			{
				label: '7 days',
				getRange: () => {
					const to = clampDate(getStartOfToday(), minDate, maxDate);
					const from = new Date(to);
					from.setDate(to.getDate() - 6);
					return {
						from: toDateInputValue(clampDate(from, minDate, maxDate)),
						to: toDateInputValue(to),
					};
				},
			},
			{
				label: 'This week',
				getRange: () => {
					const to = clampDate(getStartOfToday(), minDate, maxDate);
					const mondayOffset = (to.getDay() + 6) % 7;
					const from = new Date(to);
					from.setDate(to.getDate() - mondayOffset);
					return {
						from: toDateInputValue(clampDate(from, minDate, maxDate)),
						to: toDateInputValue(to),
					};
				},
			},
			{
				label: '30 days',
				getRange: () => {
					const to = clampDate(getStartOfToday(), minDate, maxDate);
					const from = new Date(to);
					from.setDate(to.getDate() - 29);
					return {
						from: toDateInputValue(clampDate(from, minDate, maxDate)),
						to: toDateInputValue(to),
					};
				},
			},
			{
				label: 'This month',
				getRange: () => {
					const to = clampDate(getStartOfToday(), minDate, maxDate);
					const from = new Date(to.getFullYear(), to.getMonth(), 1);
					return {
						from: toDateInputValue(clampDate(from, minDate, maxDate)),
						to: toDateInputValue(to),
					};
				},
			},
			{
				label: 'This year',
				getRange: () => {
					const to = clampDate(getStartOfToday(), minDate, maxDate);
					const from = new Date(to.getFullYear(), 0, 1);
					return {
						from: toDateInputValue(clampDate(from, minDate, maxDate)),
						to: toDateInputValue(to),
					};
				},
			},
		],
		[minDate, maxDate],
	);

	const activePreset = useMemo(() => {
		return presets.find((preset) => {
			const range = preset.getRange();
			return range.from === normalizedFrom && range.to === normalizedTo;
		});
	}, [presets, normalizedFrom, normalizedTo]);

	const selectedRange = useMemo<DateRange | undefined>(() => {
		if (!draftRange.from && !draftRange.to) return undefined;

		return {
			from: draftRange.from ? parseDateInput(draftRange.from) : undefined,
			to: draftRange.to ? parseDateInput(draftRange.to) : undefined,
		};
	}, [draftRange.from, draftRange.to]);

	const disabledDates = useMemo(() => {
		if (minDate && maxDate) return { before: minDate, after: maxDate };
		if (minDate) return { before: minDate };
		if (maxDate) return { after: maxDate };
		return undefined;
	}, [minDate, maxDate]);

	const normalizeRange = (next: DateRangeValue): DateRangeValue => {
		const fromDate = next.from
			? clampDate(parseDateInput(next.from), minDate, maxDate)
			: undefined;
		let toDate = next.to ? clampDate(parseDateInput(next.to), minDate, maxDate) : undefined;

		if (fromDate && toDate && fromDate > toDate) {
			toDate = fromDate;
		}

		return {
			from: fromDate ? toDateInputValue(fromDate) : undefined,
			to: toDate ? toDateInputValue(toDate) : undefined,
		};
	};

	const commitRange = (next: DateRangeValue) => {
		onChange(normalizeRange(next));
	};

	const handleCalendarSelect = (range: DateRange | undefined) => {
		const next: DateRangeValue = {
			from: range?.from ? toDateInputValue(range.from) : undefined,
			to: range?.to ? toDateInputValue(range.to) : undefined,
		};
		setDraftRange(next);
		if (next.from && next.to) {
			commitRange(next);
		}
	};

	const handlePresetClick = (preset: DatePreset) => {
		commitRange(preset.getRange());
	};

	const defaultMonth =
		selectedRange?.from ?? selectedRange?.to ?? maxDate ?? minDate ?? getStartOfToday();

	const calendarContent = (
		<>
			<div className='border-ctp-surface1 flex flex-wrap gap-2 border-b p-3'>
				{presets.map((preset) => (
					<button
						key={preset.label}
						type='button'
						onClick={() => handlePresetClick(preset)}
						aria-pressed={activePreset?.label === preset.label}
						className={cn(
							'rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
							activePreset?.label === preset.label
								? 'border-ctp-blue bg-ctp-blue text-ctp-crust'
								: 'border-ctp-surface1 bg-ctp-surface0/70 text-ctp-subtext1 hover:border-ctp-blue/60 hover:bg-ctp-surface1 hover:text-ctp-text',
						)}
					>
						{preset.label}
					</button>
				))}
			</div>
			<div className='border-ctp-surface1 bg-ctp-surface0/60 grid grid-cols-2 gap-2 border-b p-3'>
				<label className='text-ctp-subtext1 text-xs font-medium'>
					From
					<input
						id={`${inputId}-from`}
						type='text'
						value={
							draftRange.from
								? formatDisplayDate(parseDateInput(draftRange.from))
								: ''
						}
						placeholder='DD.MM.YYYY'
						readOnly
						inputMode='none'
						aria-label='From date'
						className='bg-ctp-base border-ctp-surface1 text-ctp-text focus:border-ctp-blue mt-1 block w-full rounded-md border px-2 py-1.5 text-xs font-normal focus:outline-none'
					/>
				</label>
				<label className='text-ctp-subtext1 text-xs font-medium'>
					To
					<input
						id={`${inputId}-to`}
						type='text'
						value={
							draftRange.to ? formatDisplayDate(parseDateInput(draftRange.to)) : ''
						}
						placeholder='DD.MM.YYYY'
						readOnly
						inputMode='none'
						aria-label='To date'
						className='bg-ctp-base border-ctp-surface1 text-ctp-text focus:border-ctp-blue mt-1 block w-full rounded-md border px-2 py-1.5 text-xs font-normal focus:outline-none'
					/>
				</label>
			</div>
			<Calendar
				mode='range'
				min={1}
				selected={selectedRange}
				defaultMonth={defaultMonth}
				showOutsideDays
				captionLayout='dropdown'
				className='bg-ctp-mantle w-full px-0.5 py-3'
				disabled={disabledDates}
				onSelect={handleCalendarSelect}
			/>
			<div className='border-ctp-surface1 bg-ctp-surface0/40 flex items-center justify-end gap-2 border-t p-3'>
				<Button
					variant='ghost'
					size='xs'
					className='text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text'
					onClick={() => commitRange({ from: undefined, to: undefined })}
				>
					Clear
				</Button>
			</div>
		</>
	);

	return (
		<div className='border-ctp-surface1 bg-ctp-mantle w-full overflow-hidden rounded-lg border shadow-xl'>
			{calendarContent}
		</div>
	);
};
