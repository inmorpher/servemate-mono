'use client';

import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { Filter } from '@/shared/components/filter/index';
import FilterReset from '@/shared/components/filter/ui/FilterReset';
import { normalizeDateInput } from '@/shared/components/filter/ui/date-helpers';
import { useOrderFilters } from '../hooks/useOrderFilters';
import { PriceRangeFilter } from './PriceRangeFilter';

export const OrderFilters = () => {
	const {
		metaData,
		filters,
		handleAllergyToggle,
		handlePriceRangeChange,
		handleStatusToggle,
		handleTableNumber,
		handleRangeChange,
	} = useOrderFilters();

	return (
		<Filter>
			<FilterReset filters={filters} />
			{metaData?.dates && (
				<Filter.Group label='Order Date' plain>
					<Filter.DateRange
						from={normalizeDateInput(filters?.dateFrom)}
						to={normalizeDateInput(filters?.dateTo)}
						min={normalizeDateInput(metaData.dates.min)}
						max={normalizeDateInput(metaData.dates.max)}
						onChange={(range) => handleRangeChange({ from: range.from, to: range.to })}
					/>
				</Filter.Group>
			)}
			{/* Allergies Filter */}
			{metaData?.allergies && (
				<Filter.Group label='Allergies'>
					{orderSearchOptions.allergies.map((option) => (
						<SearchChip
							key={option.value}
							isActive={filters?.allergies?.includes(option.value)}
							onClick={() => handleAllergyToggle(option.value)}
						>
							{option.value}
						</SearchChip>
					))}
				</Filter.Group>
			)}
			{/* Price Range Filter */}
			{metaData?.prices && (
				<Filter.Group label='Price Range'>
					<PriceRangeFilter
						minValue={metaData.prices.min}
						maxValue={metaData.prices.max}
						onChange={handlePriceRangeChange}
						value={
							filters?.minAmount !== undefined && filters?.maxAmount !== undefined
								? [filters.minAmount, filters.maxAmount]
								: [metaData.prices.min, metaData.prices.max]
						}
					/>
				</Filter.Group>
			)}
			{/* Status Filter */}
			<Filter.Group label='Status'>
				{(metaData?.statuses ?? []).map((status) => (
					<SearchChip
						key={status}
						isActive={filters?.status === status}
						onClick={() => handleStatusToggle(status)}
					>
						{status.replaceAll('_', ' ')}
					</SearchChip>
				))}
			</Filter.Group>
			<Filter.Group label='Tables'>
				{metaData?.tableNumbers.map((t: number) => (
					<SearchChip
						key={t}
						isActive={filters?.tableNumbers?.includes(t)}
						onClick={() => handleTableNumber(t)}
					>
						{t}
					</SearchChip>
				))}
			</Filter.Group>
		</Filter>
	);
};

export default OrderFilters;
