'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { tablesEndpoints } from '../api';
import type { TablesMeta } from '../types';

export const useGetTablesMeta = () =>
	useApiQuery<TablesMeta>(tablesEndpoints.meta, undefined, {
		queryKeyScope: 'tables-meta',
		refetchOnWindowFocus: false,
	});
