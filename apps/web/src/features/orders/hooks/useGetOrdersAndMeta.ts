'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { OrderQuery, OrderSearchResultDto } from '@servemate/shared-dto';
import { orderEndpoints } from '../api';
import { useGetOrdersMeta } from './useGetOrdersMeta';

export const useGetOrdersAndMeta = (orderSearchCriteria: Partial<OrderQuery> = {}) => {
	const ordersQuery = useApiQuery<OrderSearchResultDto>(
		orderEndpoints.list,
		orderSearchCriteria,
		{
			queryKeyScope: 'orders',
			refetchOnWindowFocus: false,
		},
	);
	const orderMetaQuery = useGetOrdersMeta();

	return {
		orders: ordersQuery,
		ordersMeta: orderMetaQuery,
	};
};
