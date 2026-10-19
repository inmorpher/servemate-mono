import { Button } from '@/shared/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';

import { Calendar } from '@/shared/components/calendar';
import { cn } from '@/shared/utils/classNames';
import { ChevronDownIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { Matcher } from 'react-day-picker';

interface DatePickerFieldProps {
	label: string;
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	disabled?: Matcher | Matcher[] | undefined;
	placeholder?: string;
	id?: string;
}

/**
 * A date picker field component that allows users to select a date from a calendar popup.
 *
 * @component
 * @example
 * const [date, setDate] = useState<Date>();
 * return (
 *   <DatePickerField
 *     label="Birth Date"
 *     value={date}
 *     onChange={setDate}
 *     placeholder="Select your birth date"
 *   />
 * )
 *
 * @param {DatePickerFieldProps} props - The component props
 * @param {string} props.label - The label text displayed above the date picker
 * @param {Date | undefined} props.value - The currently selected date value
 * @param {(date: Date | undefined) => void} props.onChange - Callback function triggered when a date is selected
 * @param {boolean} [props.disabled] - Whether the date picker is disabled
 * @param {string} [props.placeholder='Select date'] - Placeholder text shown when no date is selected
 *
 * @returns {JSX.Element} A popover-based date picker component with calendar functionality
 */
export const DatePickerField = ({
	label,
	value,
	onChange,
	disabled,
	placeholder = 'Select date',
	id,
}: DatePickerFieldProps) => {
	const [open, setOpen] = useState(false);
	const generatedId = useId();
	const triggerId = id ?? `date-picker-${generatedId}`;

	const handleSelect = (date: Date | undefined) => {
		onChange(date);
		setOpen(false);
	};

	return (
		<div>
			<label htmlFor={triggerId} className='text-ctp-subtext1 mb-2 block text-sm font-medium'>
				{label}
			</label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id={triggerId}
						variant='outline'
						className='bg-ctp-mantle border-ctp-surface1 text-ctp-text hover:bg-ctp-surface0 hover:text-ctp-text w-full justify-between font-normal'
						aria-haspopup='dialog'
						aria-expanded={open}
					>
						{value ? value.toLocaleDateString() : placeholder}
						<ChevronDownIcon className='h-4 w-4' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className={cn('w-auto overflow-hidden p-0')} align='center'>
					<Calendar
						mode='single'
						navLayout='after'
						selected={value}
						defaultMonth={value}
						showOutsideDays
						captionLayout='dropdown'
						className='bg-ctp-mantle/50 border-ctp-surface1 rounded-md border p-3 shadow-lg ring-1 backdrop-blur-md'
						onSelect={handleSelect}
						disabled={disabled}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};
