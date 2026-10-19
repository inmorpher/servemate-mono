import { FilterContainer } from './ui/FilterContainer';
import { FilterDateRange } from './ui/FilterDateRange';
import { FilterGroup } from './ui/FilterGroup';

export const Filter = Object.assign(FilterContainer, {
	Group: FilterGroup,
	DateRange: FilterDateRange,
});
