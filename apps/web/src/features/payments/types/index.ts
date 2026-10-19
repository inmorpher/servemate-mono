import type { paths } from '@/shared/api/api-types';

export type PaymentSearchCriteria = Omit<
	Partial<paths['/api/payments']['get']['parameters']['query']>,
	'sortOrder'
> & {
	sortOrder?: 'asc' | 'desc';
};

export type PaymentListResult =
	paths['/api/payments']['get']['responses'][200]['content']['application/json'];
export type PaymentListItem = PaymentListResult['payments'][number];
export type PaymentsMeta =
	paths['/api/payments/meta']['get']['responses'][200]['content']['application/json'];
