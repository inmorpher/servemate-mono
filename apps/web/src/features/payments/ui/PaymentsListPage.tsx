'use client';

import { Pagination } from '@/shared/components/pagination';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { useGetPayments } from '../hooks/useGetPayments';
import type { PaymentSearchCriteria } from '../types';
import { PaymentFilters } from './PaymentFilters';
import { PaymentsTable } from './PaymentsTable';

const PaymentsListPage = ({ tabId }: { tabId: Tab['id'] }) => {
	const { filters, handleSortChange, handlePageChange, handlePageSizeChange } =
		useListPageState<PaymentSearchCriteria>({ tabId });
	const { data, error, isError, isLoading, refetch } = useGetPayments(filters);

	if (isError) {
		return <ListError error={error.message} refetch={refetch} isLoading={isLoading} />;
	}

	return (
		<ListPageLayout
			title='Payments'
			description='Review payment amounts, statuses, and linked orders.'
			filters={<PaymentFilters tabId={tabId} />}
			content={
				<PaymentsTable
					payments={data?.payments}
					isLoading={isLoading}
					sortBy={filters.sortBy}
					sortOrder={filters.sortOrder}
					onSortChange={handleSortChange}
				/>
			}
			footer={
				<Pagination
					totalCount={data?.totalCount ?? 0}
					totalPages={data?.totalPages ?? 1}
					currentPage={data?.page ?? filters.page ?? 1}
					pageSize={data?.pageSize ?? filters.pageSize ?? 10}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			}
		/>
	);
};

export default PaymentsListPage;
