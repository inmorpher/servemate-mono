'use client';

import { useMutation } from '@tanstack/react-query';
import { orderApiClient } from '../api';

export const useCallOrderItems = () => {
	return useMutation({
		mutationFn: ({ id }: { id: string }) => orderApiClient.callOrderItems(id),
	});
};