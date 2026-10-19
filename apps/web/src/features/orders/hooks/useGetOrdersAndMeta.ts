'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { OrderSearchCriteria, OrderSearchListResult } from '@servemate/dto';
import { orderEndpoints } from '../api';
import { useGetOrdersMeta } from './useGetOrdersMeta';

export const useGetOrdersAndMeta = (orderSearchCriteria: Partial<OrderSearchCriteria> = {}) => {
	const ordersQuery = useApiQuery<OrderSearchListResult>(
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
