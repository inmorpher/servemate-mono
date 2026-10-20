'use client';

import { OrderMetaDto } from '@servemate/shared-dto';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { orderApiClient } from '../api';

export const useGetOrdersMeta = () => {
	return useQuery<OrderMetaDto>({
		queryKey: ['orders', 'meta'],
		queryFn: () => orderApiClient.getMeta(),
		placeholderData: keepPreviousData,
		staleTime: 5 * 60 * 1000,
		refetchInterval: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});
};
