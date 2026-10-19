'use client';

import { Button } from '@/shared/components/button';
import { Pagination } from '@/shared/components/pagination';
import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { OrderSearchCriteria } from '@servemate/dto';
import { useGetOrdersAndMeta } from '../hooks/useGetOrdersAndMeta';
import OrderFilters from './OrderFilters';
import { OrderList } from './OrderList';

export const OrdersListPage = ({ tabId }: { tabId: Tab['id'] }) => {
	const { filters, handleSortChange, handlePageChange, handlePageSizeChange } =
		useListPageState<OrderSearchCriteria>({ tabId });

	const { orders } = useGetOrdersAndMeta(filters || {});
	const { data, error, isError, isLoading, refetch } = orders;

	if (isError) {
		return <ListError error={error?.message} refetch={refetch} isLoading={isLoading} />;
	}

	return (
		<ListPageLayout
			title='Orders'
			description='Manage and review all orders in one place.'
			actions={
				<>
					<Button variant='outline' size='sm'>
						Export
					</Button>
					<Button size='sm'>Create order</Button>
				</>
			}
			filters={<OrderFilters />}
			content={
				<OrderList
					orders={data?.orders}
					isLoading={isLoading}
					onSortChange={handleSortChange}
					sortBy={filters?.sortBy}
					sortOrder={filters?.sortOrder}
				/>
			}
			footer={
				<Pagination
					totalCount={data?.totalCount || 0}
					totalPages={data?.totalPages || 0}
					currentPage={filters?.page || 1}
					pageSize={filters?.pageSize || 10}
					onPageSizeChange={handlePageSizeChange}
					onPageChange={handlePageChange}
				/>
			}
		/>
	);
};

export default OrdersListPage;
