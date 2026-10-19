import { cn } from '@/shared/utils/classNames';
import { useTabs } from '../../tabs/store/useTabs';

interface FilterResetProps {
	filters?: Record<string, any>;
}

const FilterReset = ({ filters }: FilterResetProps) => {
	const { clearFilters, getTabById, activeTabId } = useTabs();

	const hasActiveFilters =
		filters &&
		Object.values(filters).some(
			(value) =>
				value !== undefined &&
				value !== null &&
				value !== '' &&
				(Array.isArray(value) ? value.length > 0 : true),
		);

	const handleClear = () => {
		const tab = getTabById(activeTabId);
		if (tab) {
			clearFilters(tab.id);
		}
	};

	return (
		<button
			className={cn(
				'text-ctp-red hover:bg-ctp-red/10 focus:bg-ctp-red/20 w-full rounded-md px-3 py-1.5 text-sm',
				!hasActiveFilters && 'cursor-not-allowed opacity-50',
			)}
			onClick={handleClear}
			disabled={!hasActiveFilters}
		>
			Clear Filters
		</button>
	);
};

export default FilterReset;
