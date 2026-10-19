import { FilterDateRange } from '../filter/ui/FilterDateRange';
import { normalizeDateInput, parseDateInput } from '../filter/ui/date-helpers';

interface DateRangePickerProps {
	dates?: {
		startDate: string;
		endDate: string;
	};
	onRangeChange: (range: { startDate: Date | undefined; endDate: Date | undefined }) => void;
}

const toDateValue = (value: string | undefined) => {
	return normalizeDateInput(value);
};

export const DateRangePicker = ({ dates, onRangeChange }: DateRangePickerProps) => {
	return (
		<FilterDateRange
			from={toDateValue(dates?.startDate)}
			to={toDateValue(dates?.endDate)}
			onChange={(range) =>
				onRangeChange({
					startDate: range.from ? parseDateInput(range.from) : undefined,
					endDate: range.to ? parseDateInput(range.to) : undefined,
				})
			}
		/>
	);
};
