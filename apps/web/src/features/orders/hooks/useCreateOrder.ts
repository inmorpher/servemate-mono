'use client';

import { useMutation } from '@tanstack/react-query';
import { OrderCreate } from '@servemate/shared-dto';
import { orderApiClient } from '../api';

export const useCreateOrder = () => {
	return useMutation({
		mutationFn: (body: OrderCreate) => orderApiClient.createOrder(body),
	});
};