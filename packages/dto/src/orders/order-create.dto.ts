import { Allergy, DiscountType, OrderState } from '../enums';
import z from 'zod';

import {
  CreateGuestItemsSchema,
  DISCOUNT_RANGE_MESSAGE,
  isValidDiscount,
} from './order-item.dto';

export const OrderCreateSchema = z
  .object({
    tableNumber: z.coerce.number().int().positive(),
    guestsCount: z.coerce.number().int().positive(),
    serverId: z.coerce.number().int().positive(),
    status: z.enum(OrderState).default(OrderState.RECEIVED),
    comments: z.string().nullable().optional(),
    discount: z.coerce.number().nonnegative().default(0),
    discountType: z.enum(DiscountType).default(DiscountType.PERCENT),
    allergies: z.array(z.enum(Allergy)).default([]),
    foodItems: z.array(CreateGuestItemsSchema).default([]),
    drinkItems: z.array(CreateGuestItemsSchema).default([]),
  })
  .refine(order => order.foodItems.length > 0 || order.drinkItems.length > 0, {
    message: 'At least one food item or drink item must be provided.',
    path: ['foodItems', 'drinkItems'],
  })
  .refine(order => isValidDiscount(order.discount, order.discountType), {
    message: DISCOUNT_RANGE_MESSAGE,
    path: ['discount'],
  });

export type OrderCreate = z.infer<typeof OrderCreateSchema>;
