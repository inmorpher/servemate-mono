import { ClassNames } from 'react-day-picker';

export const calendarStyles: Partial<ClassNames> = {
	root: 'text-ctp-text',
	months: 'flex-col gap-3',
	month: 'w-full',
	nav: 'justify-between px-1',
	button_previous: 'text-ctp-subtext1 rounded-md p-1 hover:bg-ctp-surface1 hover:text-ctp-text',
	button_next: 'text-ctp-subtext1 rounded-md p-1 hover:bg-ctp-surface1 hover:text-ctp-text',
	month_caption: 'justify-center items-center text-ctp-text font-semibold',
	dropdowns: 'flex justify-center items-center gap-1.5',
	dropdown_root:
		'relative z-10 min-h-9 min-w-20 overflow-hidden rounded-md border border-ctp-surface1 bg-ctp-surface0 max-sm:min-h-11',
	dropdown:
		'relative z-20 block h-9 w-full cursor-pointer appearance-auto border-0 bg-transparent px-2 text-center text-xs font-medium text-ctp-text outline-none touch-manipulation max-sm:h-11 max-sm:px-3 max-sm:text-sm',
	caption_label:
		'pointer-events-none absolute inset-0 z-0 flex min-h-9 items-center justify-center gap-1 px-2 text-xs font-medium opacity-0 max-sm:min-h-11 max-sm:px-3 max-sm:text-sm',
	month_grid: 'w-full border-collapse',
	weekdays: 'flex',
	weekday:
		'h-9 min-w-0 flex-1 p-0 text-center text-ctp-subtext0 rounded-md text-[0.7rem] font-medium uppercase max-sm:h-10 max-sm:text-xs',
	week: 'mt-1 flex w-full',
	focused: 'ring-2 ring-ctp-blue/50',
	day: 'h-10 min-w-0 flex-1 p-0 font-normal text-ctp-text bg-transparent rounded-md transition-colors max-sm:h-12',

	outside: 'text-ctp-overlay0 opacity-70',

	disabled: 'text-ctp-overlay0 cursor-not-allowed opacity-50',

	week_number: 'text-ctp-subtext0 text-xs',
	week_number_header: 'text-ctp-subtext0 text-xs',

	range_start: 'bg-ctp-blue/20 rounded-l-md',
	range_middle: 'bg-ctp-blue/20 rounded-none',
	range_end: 'bg-ctp-blue/20 rounded-r-md',
	selected: 'font-semibold',
	today: 'rounded-md border border-ctp-blue',
};
