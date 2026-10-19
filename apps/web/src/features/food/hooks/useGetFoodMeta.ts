'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { foodEndpoints } from '../api';
import type { FoodMeta } from '../types';

export const useGetFoodMeta = () =>
	useApiQuery<FoodMeta>(foodEndpoints.meta, undefined, {
		queryKeyScope: 'food-meta',
		refetchOnWindowFocus: false,
	});
