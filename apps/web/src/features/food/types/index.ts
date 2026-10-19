import type { paths } from '@/shared/api/api-types';

export type FoodSearchCriteria = Omit<
	Partial<paths['/api/food-items']['get']['parameters']['query']>,
	'sortOrder' | 'ingredients'
> & {
	sortOrder?: 'asc' | 'desc';
};

export type FoodItemsListResult =
	paths['/api/food-items']['get']['responses'][200]['content']['application/json'];
export type FoodItem = FoodItemsListResult['items'][number];
export type FoodMeta =
	paths['/api/food-items/meta']['get']['responses'][200]['content']['application/json'];
