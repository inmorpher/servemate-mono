'use client';

import { useMutation } from '@tanstack/react-query';
import { orderApiClient } from '../api';

export const usePrintOrderItems = () => {
	return useMutation({
		mutationFn: ({ id }: { id: string }) => orderApiClient.printOrderItems(id),
	});
};