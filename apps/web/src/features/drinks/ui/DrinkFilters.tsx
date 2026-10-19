'use client';

import { Button } from '@/shared/components/button';
import { Filter } from '@/shared/components/filter';
import { useDrinkFilters } from '../hooks/useDrinkFilters';
import { useGetDrinksMeta } from '../hooks/useGetDrinksMeta';

const inputClassName =
	'bg-ctp-surface0 border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:ring-ctp-blue w-full rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none';

export const DrinkFilters = ({ tabId }: { tabId: string }) => {
	const {
		filters,
		nameValue,
		handleNameChange,
		handleCategoryChange,
		handleAvailabilityChange,
		handleVolumeChange,
		handleClearFilters,
		hasFilters,
	} = useDrinkFilters(tabId);
	const {
		data: meta,
		isLoading: isMetaLoading,
		isError: isMetaError,
		error: metaError,
		refetch: refetchMeta,
	} = useGetDrinksMeta();

	return (
		<Filter className='max-h-dvh'>
			<button
				type='button'
				className='text-ctp-red hover:bg-ctp-red/10 focus:bg-ctp-red/20 h-10 w-full rounded-md px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50'
				onClick={handleClearFilters}
				disabled={!hasFilters}
			>
				Clear filters
			</button>
			{isMetaLoading ? (
				<p role='status' className='text-ctp-subtext0 text-sm'>
					Loading drink filters...
				</p>
			) : null}
			{isMetaError ? (
				<div role='alert' className='text-ctp-red space-y-2 text-sm'>
					<p>Could not load drink filters: {metaError.message}</p>
					<Button variant='outline' size='sm' onClick={() => refetchMeta()}>
						Retry
					</Button>
				</div>
			) : null}

			<Filter.Group label='Drinks'>
				<div className='grid w-full gap-3'>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Name
						<input
							className={inputClassName}
							value={nameValue}
							onChange={(event) => handleNameChange(event.currentTarget.value)}
							placeholder='Search by name'
						/>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Category
						<select
							className={inputClassName}
							value={filters?.category ?? ''}
							disabled={isMetaLoading || isMetaError}
							onChange={(event) => handleCategoryChange(event.currentTarget.value)}
						>
							<option value=''>All categories</option>
							{meta?.categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Availability
						<select
							className={inputClassName}
							disabled={isMetaLoading || isMetaError}
							value={
								filters?.isAvailable === undefined
									? ''
									: String(filters.isAvailable)
							}
							onChange={(event) =>
								handleAvailabilityChange(event.currentTarget.value)
							}
						>
							<option value=''>All statuses</option>
							{meta?.availabilityStates.map((isAvailable) => (
								<option key={String(isAvailable)} value={String(isAvailable)}>
									{isAvailable ? 'Available' : 'Unavailable'}
								</option>
							))}
						</select>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Volume
						<input
							className={inputClassName}
							type='number'
							min={meta?.volumeRange.min ?? 0}
							max={meta?.volumeRange.max}
							step='any'
							value={filters?.volume ?? ''}
							onChange={(event) => handleVolumeChange(event.currentTarget.value)}
						/>
					</label>
				</div>
			</Filter.Group>
		</Filter>
	);
};
