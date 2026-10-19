'use client';

import { useMutation } from '@tanstack/react-query';
import { OrderCreateDTO } from '@servemate/dto';
import { orderApiClient } from '../api';

export const useCreateOrder = () => {
	return useMutation({
		mutationFn: (body: OrderCreateDTO) => orderApiClient.createOrder(body),
	});
};