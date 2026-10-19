'use client';

import { Button } from '@/shared/components/button';
import { Filter } from '@/shared/components/filter';
import { useGetPaymentsMeta } from '../hooks/useGetPaymentsMeta';
import { usePaymentFilters } from '../hooks/usePaymentFilters';

const inputClassName =
	'bg-ctp-surface0 border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:ring-ctp-blue w-full rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none';

export const PaymentFilters = ({ tabId }: { tabId: string }) => {
	const { filters, handleStatusChange, handleOrderChange, handleClearFilters, hasFilters } =
		usePaymentFilters(tabId);
	const {
		data: meta,
		isLoading: isMetaLoading,
		isError: isMetaError,
		error: metaError,
		refetch: refetchMeta,
	} = useGetPaymentsMeta();

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
					Loading payment filters...
				</p>
			) : null}
			{isMetaError ? (
				<div role='alert' className='text-ctp-red space-y-2 text-sm'>
					<p>Could not load payment filters: {metaError.message}</p>
					<Button variant='outline' size='sm' onClick={() => refetchMeta()}>
						Retry
					</Button>
				</div>
			) : null}

			<Filter.Group label='Payments'>
				<div className='grid w-full gap-3'>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Status
						<select
							className={inputClassName}
							value={filters?.status ?? ''}
							disabled={isMetaLoading || isMetaError}
							onChange={(event) => handleStatusChange(event.currentTarget.value)}
						>
							<option value=''>All statuses</option>
							{meta?.statuses.map((status) => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
						</select>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Order
						<select
							className={inputClassName}
							value={filters?.orderId ?? ''}
							disabled={isMetaLoading || isMetaError}
							onChange={(event) => handleOrderChange(event.currentTarget.value)}
						>
							<option value=''>All orders</option>
							{meta?.orderIds.map((orderId) => (
								<option key={orderId} value={orderId}>
									Order #{orderId}
								</option>
							))}
						</select>
					</label>
				</div>
			</Filter.Group>
		</Filter>
	);
};
