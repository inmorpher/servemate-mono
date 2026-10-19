import type { paths } from '@/shared/api/api-types';

export type TableSearchCriteria = Omit<
	Partial<paths['/api/tables']['get']['parameters']['query']>,
	'sortOrder'
> & {
	sortOrder?: 'asc' | 'desc';
};

export type TablesListResult =
	paths['/api/tables']['get']['responses'][200]['content']['application/json'];
export type RestaurantTable = TablesListResult['tables'][number];
export type TablesMeta =
	paths['/api/tables/meta']['get']['responses'][200]['content']['application/json'];
