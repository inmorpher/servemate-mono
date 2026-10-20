'use client';

import { useMutation } from '@tanstack/react-query';
import { OrderUpdate } from '@servemate/shared-dto';
import { orderApiClient } from '../api';

export const useUpdateOrderProperties = () => {
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: OrderUpdate }) =>
			orderApiClient.updateOrderProperties(id, body),
	});
};