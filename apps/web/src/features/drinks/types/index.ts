import type {
	DrinkItemDTO,
	DrinkItemsListDTO,
	DrinkMetaDto,
	SearchDrinkItemsDTO,
} from '@servemate/shared-dto';

export type DrinkSearchCriteria = Partial<SearchDrinkItemsDTO>;

export type DrinkItemsListResult = DrinkItemsListDTO;
export type DrinkItem = DrinkItemDTO;
export type DrinksMeta = DrinkMetaDto;
