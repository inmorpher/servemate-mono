'use client';

import { Button } from '@/shared/components/button';
import { Filter } from '@/shared/components/filter';
import { useGetTablesMeta } from '../hooks/useGetTablesMeta';
import { useTableFilters } from '../hooks/useTableFilters';

const inputClassName =
	'bg-ctp-surface0 border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:ring-ctp-blue w-full rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none';

export const TableFilters = ({ tabId }: { tabId: string }) => {
	const {
		filters,
		handleStatusChange,
		handleOccupiedChange,
		handleNumberChange,
		handleClearFilters,
		hasFilters,
	} = useTableFilters(tabId);
	const {
		data: meta,
		isLoading: isMetaLoading,
		isError: isMetaError,
		error: metaError,
		refetch: refetchMeta,
	} = useGetTablesMeta();

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
					Loading table filters...
				</p>
			) : null}
			{isMetaError ? (
				<div role='alert' className='text-ctp-red space-y-2 text-sm'>
					<p>Could not load table filters: {metaError.message}</p>
					<Button variant='outline' size='sm' onClick={() => refetchMeta()}>
						Retry
					</Button>
				</div>
			) : null}

			<Filter.Group label='Status and occupancy'>
				<div className='grid w-full gap-3'>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Status
						<select
							className={inputClassName}
							value={filters?.status ?? ''}
							disabled={isMetaLoading || isMetaError}
							onChange={(event) => handleStatusChange(event.currentTarget.value)}
							aria-required='true'
						>
							<option value=''>Choose status</option>
							{meta?.statuses.map((status) => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
						</select>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Occupancy
						<select
							className={inputClassName}
							disabled={isMetaLoading || isMetaError}
							value={
								filters?.isOccupied === undefined ? '' : String(filters.isOccupied)
							}
							onChange={(event) => handleOccupiedChange(event.currentTarget.value)}
							aria-required='true'
						>
							<option value=''>Choose occupancy</option>
							{meta?.occupiedStates.map((isOccupied) => (
								<option key={String(isOccupied)} value={String(isOccupied)}>
									{isOccupied ? 'Occupied' : 'Not occupied'}
								</option>
							))}
						</select>
					</label>
				</div>
			</Filter.Group>

			<Filter.Group label='Table details'>
				<div className='grid w-full gap-3'>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Table number
						<select
							className={inputClassName}
							disabled={isMetaLoading || isMetaError}
							value={filters?.tableNumber ?? ''}
							onChange={(event) =>
								handleNumberChange('tableNumber', event.currentTarget.value)
							}
						>
							<option value=''>All tables</option>
							{meta?.tableNumbers.map((tableNumber) => (
								<option key={tableNumber} value={tableNumber}>
									Table {tableNumber}
								</option>
							))}
						</select>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Minimum capacity
						<input
							className={inputClassName}
							type='number'
							min={meta?.capacityRange.min}
							max={meta?.capacityRange.max}
							value={filters?.minCapacity ?? ''}
							onChange={(event) =>
								handleNumberChange('minCapacity', event.currentTarget.value)
							}
						/>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Maximum capacity
						<input
							className={inputClassName}
							type='number'
							min={meta?.capacityRange.min}
							max={meta?.capacityRange.max}
							value={filters?.maxCapacity ?? ''}
							onChange={(event) =>
								handleNumberChange('maxCapacity', event.currentTarget.value)
							}
						/>
					</label>
				</div>
			</Filter.Group>
		</Filter>
	);
};
