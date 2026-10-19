'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { reservationsEndpoints } from '../api';
import type { ReservationsMeta } from '../types';

export const useGetReservationsMeta = () =>
	useApiQuery<ReservationsMeta>(reservationsEndpoints.meta, undefined, {
		queryKeyScope: 'reservations-meta',
		refetchOnWindowFocus: false,
	});
