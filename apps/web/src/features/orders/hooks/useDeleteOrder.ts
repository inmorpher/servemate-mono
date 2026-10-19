'use client';

import { OrderSearchListResult } from '@servemate/dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApiClient } from '../api';

export const useDeleteOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		onMutate: async ({ id }: { id: string }) => {
			await queryClient.cancelQueries({ queryKey: ['orders'] });

			const previousOrdersQueries = queryClient.getQueriesData<OrderSearchListResult>({
				queryKey: ['orders'],
			});

			queryClient.setQueriesData<OrderSearchListResult>(
				{ queryKey: ['orders'] },
				(currentData) => {
					if (!currentData?.orders) {
						return currentData;
					}

					const nextOrders = currentData.orders.filter(
						(order) => String(order.id) !== id,
					);

					if (nextOrders.length === currentData.orders.length) {
						return currentData;
					}

					return {
						...currentData,
						orders: nextOrders,
						totalCount:
							typeof currentData.totalCount === 'number'
								? Math.max(0, currentData.totalCount - 1)
								: currentData.totalCount,
					};
				},
			);

			return { previousOrdersQueries };
		},
		mutationFn: ({ id }: { id: string }) => orderApiClient.deleteOrder(id),
		onError: (_error, _variables, context) => {
			context?.previousOrdersQueries?.forEach(([queryKey, queryData]) => {
				queryClient.setQueryData(queryKey, queryData);
			});
		},
		onSettled: () => {
			void queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};
