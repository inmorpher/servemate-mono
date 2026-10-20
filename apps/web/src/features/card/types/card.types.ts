import type { DrinkItemDTO, FoodItemDTO } from '@servemate/shared-dto';

export type FoodItem = FoodItemDTO;
export type DrinkItem = DrinkItemDTO;
export type CardItem = FoodItem | DrinkItem;
