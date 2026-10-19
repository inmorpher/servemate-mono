'use client';

import { Pagination } from '@/shared/components/pagination';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { useGetDrinks } from '../hooks/useGetDrinks';
import type { DrinkSearchCriteria } from '../types';
import { DrinkFilters } from './DrinkFilters';
import { DrinksTable } from './DrinksTable';

const DrinksListPage = ({ tabId }: { tabId: Tab['id'] }) => {
	const { filters, handleSortChange, handlePageChange, handlePageSizeChange } =
		useListPageState<DrinkSearchCriteria>({ tabId });
	const { data, error, isError, isLoading, refetch } = useGetDrinks(filters);

	if (isError) {
		return <ListError error={error.message} refetch={refetch} isLoading={isLoading} />;
	}

	return (
		<ListPageLayout
			title='Drinks'
			description='Browse drinks and review availability, ingredients, and serving details.'
			filters={<DrinkFilters tabId={tabId} />}
			content={
				<DrinksTable
					drinks={data?.items}
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

export default DrinksListPage;
