'use client';

import { Pagination } from '@/shared/components/pagination';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { useGetFoodItems } from '../hooks/useGetFoodItems';
import type { FoodSearchCriteria } from '../types';
import { FoodFilters } from './FoodFilters';
import { FoodTable } from './FoodTable';

const FoodListPage = ({ tabId }: { tabId: Tab['id'] }) => {
	const { filters, handleSortChange, handlePageChange, handlePageSizeChange } =
		useListPageState<FoodSearchCriteria>({ tabId });
	const { data, error, isError, isLoading, refetch } = useGetFoodItems(filters);

	if (isError) {
		return <ListError error={error.message} refetch={refetch} isLoading={isLoading} />;
	}

	return (
		<ListPageLayout
			title='Food'
			description='Review dishes, dietary details, and preparation information.'
			filters={<FoodFilters tabId={tabId} />}
			content={
				<FoodTable
					items={data?.items}
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

export default FoodListPage;
