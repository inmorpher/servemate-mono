'use client';

import { Pagination } from '@/shared/components/pagination';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { useGetTables } from '../hooks/useGetTables';
import type { TableSearchCriteria } from '../types';
import { TableFilters } from './TableFilters';
import { TablesTable } from './TablesTable';

const TablesListPage = ({ tabId }: { tabId: Tab['id'] }) => {
	const { filters, handleSortChange, handlePageChange, handlePageSizeChange } =
		useListPageState<TableSearchCriteria>({ tabId });
	const canQuery = Boolean(filters.status?.trim()) && filters.isOccupied !== undefined;
	const { data, error, isError, isLoading, refetch } = useGetTables(filters);

	if (isError) {
		return <ListError error={error.message} refetch={refetch} isLoading={isLoading} />;
	}

	return (
		<ListPageLayout
			title='Tables'
			description='Review table occupancy, guest counts, and seating capacity.'
			filters={<TableFilters tabId={tabId} />}
			content={
				<TablesTable
					tables={data?.tables}
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

export default TablesListPage;
