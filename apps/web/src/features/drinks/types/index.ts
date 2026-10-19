import type { paths } from '@/shared/api/api-types';

export type DrinkSearchCriteria = Omit<
	Partial<paths['/api/drink-items']['get']['parameters']['query']>,
	'sortOrder'
> & {
	sortOrder?: 'asc' | 'desc';
};

export type DrinkItemsListResult =
	paths['/api/drink-items']['get']['responses'][200]['content']['application/json'];
export type DrinkItem = DrinkItemsListResult['items'][number];
export type DrinksMeta =
	paths['/api/drink-items/meta']['get']['responses'][200]['content']['application/json'];
