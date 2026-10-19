'use client';

import { useMutation } from '@tanstack/react-query';
import { OrderUpdateItems } from '@servemate/dto';
import { orderApiClient } from '../api';

export const useUpdateOrderItems = () => {
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: OrderUpdateItems }) =>
			orderApiClient.updateOrderItems(id, body),
	});
};