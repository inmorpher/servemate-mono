'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { drinksEndpoints } from '../api';
import type { DrinksMeta } from '../types';

export const useGetDrinksMeta = () =>
	useApiQuery<DrinksMeta>(drinksEndpoints.meta, undefined, {
		queryKeyScope: 'drinks-meta',
		refetchOnWindowFocus: false,
	});
