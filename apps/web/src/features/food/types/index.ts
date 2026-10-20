import type {
	FoodItemDTO,
	FoodItemsListDTO,
	FoodMetaDto,
	SearchFoodItemsDTO,
} from '@servemate/shared-dto';

export type FoodSearchCriteria = Partial<SearchFoodItemsDTO>;

export type FoodItemsListResult = FoodItemsListDTO;
export type FoodItem = FoodItemDTO;
export type FoodMeta = FoodMetaDto;
