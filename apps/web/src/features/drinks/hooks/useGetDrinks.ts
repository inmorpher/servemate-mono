'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { drinksEndpoints } from '../api';
import type { DrinkItemsListResult, DrinkSearchCriteria } from '../types';

export const useGetDrinks = (criteria: DrinkSearchCriteria = {}) =>
	useApiQuery<DrinkItemsListResult>(drinksEndpoints.list, criteria, {
		queryKeyScope: 'drinks',
		refetchOnWindowFocus: false,
	});
