'use client';

import { userSearchOptions } from '@/features/search';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { DatePickerField } from '@/shared/components/date-picker-field/DatePickerField';
import { Filter } from '@/shared/components/filter';
import { useUserFilters } from '../hooks/useUserFilters';

function UserSearchBar() {
	const {
		filters,
		nameValue,
		emailValue,
		setNameValue,
		setEmailValue,
		handleRoleToggle,
		handleStatusToggle,
		handleCreatedAfterChange,
		handleCreatedBeforeChange,
		handleClearFilters,
		hasFilters,
	} = useUserFilters();
	const isLoading = false;
	const criteria = filters || {};

	return (
		<Filter className='max-h-dvh'>
			<button
				type='button'
				className='text-ctp-red hover:bg-ctp-red/10 focus:bg-ctp-red/20 w-full rounded-md px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50'
				onClick={handleClearFilters}
				disabled={!hasFilters}
			>
				Clear Filters
			</button>

			<Filter.Group label='Search'>
				<div className='grid gap-3 md:grid-cols-2'>
					<div>
						<label className='text-ctp-subtext1 mb-2 block text-sm font-medium'>
							Name
						</label>
						<input
							type='text'
							value={nameValue}
							onChange={(event) => setNameValue(event.currentTarget.value)}
							disabled={isLoading}
							placeholder='Search by name'
							className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:ring-ctp-blue w-full rounded-lg border px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none disabled:opacity-60'
						/>
					</div>
					<div>
						<label className='text-ctp-subtext1 mb-2 block text-sm font-medium'>
							Email
						</label>
						<input
							type='email'
							value={emailValue}
							onChange={(event) => setEmailValue(event.currentTarget.value)}
							disabled={isLoading}
							placeholder='Search by email'
							className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:ring-ctp-blue w-full rounded-lg border px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none disabled:opacity-60'
						/>
					</div>
				</div>
			</Filter.Group>

			<Filter.Group label='Role'>
				{userSearchOptions.roles.map((option) => (
					<SearchChip
						key={option.value}
						isActive={criteria.role === option.value}
						onClick={() => handleRoleToggle(option.value as never)}
					>
						{option.label}
					</SearchChip>
				))}
			</Filter.Group>

			<Filter.Group label='Status'>
				{userSearchOptions.statuses.map((option) => {
					const statusValue = option.value === 'true';

					return (
						<SearchChip
							key={option.value}
							isActive={criteria.isActive === statusValue}
							onClick={() => handleStatusToggle(statusValue)}
						>
							{option.label}
						</SearchChip>
					);
				})}
			</Filter.Group>

			<Filter.Group label='Created at'>
				<div className='grid gap-3 md:grid-cols-2'>
					<DatePickerField
						label='Created after'
						value={criteria.createdAfter ? new Date(criteria.createdAfter) : undefined}
						placeholder='Select start date'
						onChange={handleCreatedAfterChange}
					/>
					<DatePickerField
						label='Created before'
						value={
							criteria.createdBefore ? new Date(criteria.createdBefore) : undefined
						}
						placeholder='Select end date'
						onChange={handleCreatedBeforeChange}
					/>
				</div>
			</Filter.Group>
		</Filter>
	);
}

export default UserSearchBar;
