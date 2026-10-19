import type { components } from '@/shared/api/api-types';

export type FoodItem = components['schemas']['foodItemSchema'];
export type DrinkItem = components['schemas']['drinkItemSchema'];
export type CardItem = FoodItem | DrinkItem;
