'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { reservationsEndpoints } from '../api';
import type { ReservationListResult, ReservationSearchCriteria } from '../types';

export const useGetReservations = (criteria: ReservationSearchCriteria = {}) =>
	useApiQuery<ReservationListResult>(reservationsEndpoints.list, criteria, {
		queryKeyScope: 'reservations',
		refetchOnWindowFocus: false,
		enabled: Boolean(criteria.status?.trim()) && Boolean(criteria.tables?.length),
	});
