'use client';

import { QueryClient, QueryClientProvider, DehydratedState, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
	children: ReactNode;
	dehydratedState?: DehydratedState;
}

export const QueryProvider = ({ children, dehydratedState }: QueryProviderProps) => {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 1,
				gcTime: 1000 * 60 * 5,
				retry: 3,
				retryDelay: (attendIndex) => Math.min(1000 * 2 ** attendIndex, 30000),
			},
		},
	}));

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={dehydratedState}>
				{children}
			</HydrationBoundary>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};
