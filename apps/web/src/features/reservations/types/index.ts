import type { paths } from '@/shared/api/api-types';

export type ReservationSearchCriteria = Omit<
	Partial<paths['/api/reservations']['get']['parameters']['query']>,
	'sortOrder'
> & {
	sortOrder?: 'asc' | 'desc';
};
export type ReservationListResult =
	paths['/api/reservations']['get']['responses'][200]['content']['application/json'];
export type ReservationListItem = ReservationListResult['list'][number];
export type ReservationsMeta =
	paths['/api/reservations/meta']['get']['responses'][200]['content']['application/json'];
