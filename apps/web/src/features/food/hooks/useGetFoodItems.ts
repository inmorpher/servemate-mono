'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { foodEndpoints } from '../api';
import type { FoodItemsListResult, FoodSearchCriteria } from '../types';

export const useGetFoodItems = (criteria: FoodSearchCriteria = {}) =>
	useApiQuery<FoodItemsListResult>(foodEndpoints.list, criteria, {
		queryKeyScope: 'food',
		refetchOnWindowFocus: false,
	});
