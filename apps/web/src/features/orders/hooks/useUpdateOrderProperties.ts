'use client';

import { useMutation } from '@tanstack/react-query';
import { OrderUpdateProps } from '@servemate/dto';
import { orderApiClient } from '../api';

export const useUpdateOrderProperties = () => {
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: OrderUpdateProps }) =>
			orderApiClient.updateOrderProperties(id, body),
	});
};