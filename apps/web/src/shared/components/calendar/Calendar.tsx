'use client';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { Button, buttonVariants } from '@/shared/components/button';
import { cn } from '@/shared/utils/classNames';
import { calendarStyles } from './calendarStyles';

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	buttonVariant = 'ghost',
	formatters,
	components,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
	const defaultClassNames = getDefaultClassNames();
	const mergeClassNames = (name: string, ...classes: Array<string | undefined>) =>
		cn(
			...classes,
			calendarStyles[name as keyof typeof calendarStyles],
			classNames?.[name as keyof typeof classNames],
		);

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				'group/calendar p-3 [--cell-size:2.75rem] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent sm:[--cell-size:2rem]',
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className,
			)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
				...formatters,
			}}
			classNames={{
				root: mergeClassNames('root', 'w-full text-ctp-text', defaultClassNames.root),
				months: mergeClassNames(
					'months',
					'relative flex w-full flex-col gap-3 md:flex-row',
					defaultClassNames.months,
				),
				month: mergeClassNames(
					'month',
					'flex w-full flex-col gap-3',
					defaultClassNames.month,
				),
				nav: mergeClassNames(
					'nav',
					'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 px-1',
					defaultClassNames.nav,
				),
				button_previous: mergeClassNames(
					'button_previous',
					buttonVariants({ variant: buttonVariant }),
					'h-[--cell-size] w-[--cell-size] select-none p-0 text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text aria-disabled:opacity-40',
					defaultClassNames.button_previous,
				),
				button_next: mergeClassNames(
					'button_next',
					buttonVariants({ variant: buttonVariant }),
					'h-[--cell-size] w-[--cell-size] select-none p-0 text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text aria-disabled:opacity-40',
					defaultClassNames.button_next,
				),
				month_caption: mergeClassNames(
					'month_caption',
					'flex h-[--cell-size] w-full items-center justify-center px-[--cell-size] text-ctp-text',
					defaultClassNames.month_caption,
				),
				dropdowns: mergeClassNames(
					'dropdowns',
					'flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-xs font-medium',
					defaultClassNames.dropdowns,
				),
				dropdown_root: mergeClassNames(
					'dropdown_root',
					'has-focus:border-ctp-blue has-focus:ring-ctp-blue/30 relative rounded-md border border-ctp-surface1 bg-ctp-surface0 shadow-none has-focus:ring-[3px]',
					defaultClassNames.dropdown_root,
				),
				dropdown: mergeClassNames('dropdown', defaultClassNames.dropdown),
				caption_label: mergeClassNames(
					'caption_label',
					'select-none font-medium text-ctp-text',
					captionLayout === 'label'
						? 'text-sm'
						: '[&>svg]:text-ctp-subtext0 flex h-8 items-center gap-1 rounded-md px-2 text-xs [&>svg]:size-3.5',
					defaultClassNames.caption_label,
				),
				weekdays: mergeClassNames('weekdays', 'flex', defaultClassNames.weekdays),
				weekday: mergeClassNames(
					'weekday',
					'text-ctp-subtext0 flex-1 select-none rounded-md text-[0.7rem] font-medium uppercase',
					defaultClassNames.weekday,
				),
				week: mergeClassNames('week', 'mt-1 flex w-full', defaultClassNames.week),
				week_number_header: mergeClassNames(
					'week_number_header',
					'w-[--cell-size] select-none',
					defaultClassNames.week_number_header,
				),
				week_number: mergeClassNames(
					'week_number',
					'text-muted-foreground select-none text-[0.8rem]',
					defaultClassNames.week_number,
				),
				day: mergeClassNames(
					'day',
					'group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md',
					defaultClassNames.day,
				),
				range_start: mergeClassNames(
					'range_start',
					'bg-ctp-blue/20 rounded-l-md',
					defaultClassNames.range_start,
				),
				range_middle: mergeClassNames(
					'range_middle',
					'bg-ctp-blue/20 rounded-none',
					defaultClassNames.range_middle,
				),
				range_end: mergeClassNames(
					'range_end',
					'bg-ctp-blue/20 rounded-r-md',
					defaultClassNames.range_end,
				),
				today: mergeClassNames(
					'today',
					'border-ctp-blue rounded-md border data-[selected=true]:rounded-none',
					defaultClassNames.today,
				),
				outside: mergeClassNames(
					'outside',
					'text-ctp-overlay0 aria-selected:text-ctp-subtext0',
					defaultClassNames.outside,
				),
				disabled: mergeClassNames(
					'disabled',
					'text-ctp-overlay0 opacity-50',
					defaultClassNames.disabled,
				),
				hidden: mergeClassNames('hidden', 'invisible', defaultClassNames.hidden),
				month_grid: mergeClassNames('month_grid', defaultClassNames.month_grid),
				focused: mergeClassNames('focused', defaultClassNames.focused),
				selected: mergeClassNames('selected', defaultClassNames.selected),
				...classNames,
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return (
						<div
							data-slot='calendar'
							ref={rootRef}
							className={cn(className)}
							{...props}
						/>
					);
				},
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === 'left') {
						return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
					}

					if (orientation === 'right') {
						return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
					}

					return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
				},
				DayButton: CalendarDayButton,
				Select: CalendarSelect,
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className='flex size-[--cell-size] items-center justify-center text-center'>
								{children}
							</div>
						</td>
					);
				},
				...components,
			}}
			{...props}
		/>
	);
}

function CalendarSelect({
	onChange,
	onClick,
	onFocus,
	onPointerDown,
	onTouchStart,
	...props
}: React.ComponentProps<'select'>) {
	const logSelectorEvent = (
		eventName: string,
		event: React.SyntheticEvent<HTMLSelectElement>,
	) => {
		console.log('[Calendar] selector event', {
			event: eventName,
			label: event.currentTarget.getAttribute('aria-label'),
			value: event.currentTarget.value,
			userAgent: navigator.userAgent,
		});
	};

	return (
		<select
			{...props}
			onPointerDown={(event) => {
				logSelectorEvent('pointerdown', event);
				onPointerDown?.(event);
			}}
			onTouchStart={(event) => {
				logSelectorEvent('touchstart', event);
				onTouchStart?.(event);
			}}
			onFocus={(event) => {
				logSelectorEvent('focus', event);
				onFocus?.(event);
			}}
			onClick={(event) => {
				logSelectorEvent('click', event);
				onClick?.(event);
			}}
			onChange={(event) => {
				logSelectorEvent('change', event);
				onChange?.(event);
			}}
		/>
	);
}

function CalendarDayButton({
	className,
	modifiers,
	...props
}: React.ComponentProps<typeof DayButton>) {
	const defaultClassNames = getDefaultClassNames();

	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	return (
		<Button
			ref={ref}
			variant='ghost'
			size='icon'
			data-selected-single={
				modifiers.selected &&
				!modifiers.range_start &&
				!modifiers.range_end &&
				!modifiers.range_middle
			}
			data-range-start={modifiers.range_start}
			data-range-end={modifiers.range_end}
			data-range-middle={modifiers.range_middle}
			className={cn(
				'data-[selected-single=true]:bg-ctp-blue data-[selected-single=true]:text-ctp-crust data-[range-middle=true]:bg-ctp-blue/20 data-[range-middle=true]:text-ctp-text data-[range-start=true]:bg-ctp-blue data-[range-start=true]:text-ctp-crust data-[range-end=true]:bg-ctp-blue data-[range-end=true]:text-ctp-crust hover:bg-ctp-surface1 hover:text-ctp-text focus-visible:ring-ctp-blue/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 leading-none font-normal focus-visible:relative focus-visible:z-10 focus-visible:ring-2 data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md [&>span]:text-xs [&>span]:opacity-70',
				defaultClassNames.day,
				className,
			)}
			{...props}
		/>
	);
}

export { Calendar, CalendarDayButton };
