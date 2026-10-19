'use client';

import { Pagination } from '@/shared/components/pagination';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { useGetReservations } from '../hooks/useGetReservations';
import type { ReservationSearchCriteria } from '../types';
import { ReservationFilters } from './ReservationFilters';
import { ReservationsTable } from './ReservationsTable';

const ReservationsListPage = ({ tabId }: { tabId: Tab['id'] }) => {
	const { filters, handleSortChange, handlePageChange, handlePageSizeChange } =
		useListPageState<ReservationSearchCriteria>({ tabId });
	const canQuery = Boolean(filters.status?.trim()) && Boolean(filters.tables?.length);
	const { data, error, isError, isLoading, refetch } = useGetReservations(filters);

	if (isError) {
		return <ListError error={error.message} refetch={refetch} isLoading={isLoading} />;
	}

	return (
		<ListPageLayout
			title='Reservations'
			description='Review and manage guest reservations.'
			filters={<ReservationFilters tabId={tabId} />}
			content={
				<ReservationsTable
					reservations={data?.list}
					isLoading={isLoading}
					canQuery={canQuery}
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

export default ReservationsListPage;
