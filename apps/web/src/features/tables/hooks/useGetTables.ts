'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { tablesEndpoints } from '../api';
import type { TableSearchCriteria, TablesListResult } from '../types';

export const useGetTables = (criteria: TableSearchCriteria = {}) =>
	useApiQuery<TablesListResult>(tablesEndpoints.list, criteria, {
		queryKeyScope: 'tables',
		refetchOnWindowFocus: false,
		enabled: Boolean(criteria.status?.trim()) && criteria.isOccupied !== undefined,
	});
