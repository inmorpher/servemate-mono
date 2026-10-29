import { Allergy, DiscountType, PaymentState } from '../enums';
import z from 'zod';

export const DISCOUNT_RANGE_MESSAGE =
  'A percent discount must be between 0 and 100';

export const isValidDiscount = (
  discount: number,
  discountType: DiscountType
): boolean => discountType === DiscountType.AMOUNT || discount <= 100;

export const OrderItemSchema = z.object({
  id: z.number().int().positive(),
  itemId: z.number().int().positive(),
  price: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  discountType: z.enum(DiscountType).default(DiscountType.PERCENT),
  finalPrice: z.number().nonnegative().default(0),
  specialRequest: z.string().nullable().default(null),
  allergies: z.array(z.enum(Allergy)).default([]),
  printed: z.boolean().default(false),
  fired: z.boolean().default(false),
  guestNumber: z.number().int().positive(),
  paymentStatus: z.enum(PaymentState).default(PaymentState.NONE),
});

export type OrderItemDto = z.infer<typeof OrderItemSchema>;

export const GuestOrderItemSchema = OrderItemSchema.omit({
  id: true,
  guestNumber: true,
});

export const GuestItemsSchema = z.object({
  guestNumber: z.number().int().positive(),
  items: z.array(GuestOrderItemSchema),
});

export type GuestItems = z.infer<typeof GuestItemsSchema>;

export const OrderItemWithProductSchema = OrderItemSchema.extend({
  foodItem: z
    .object({
      id: z.number().int().positive(),
      name: z.string(),
    })
    .optional(),
  drinkItem: z
    .object({
      id: z.number().int().positive(),
      name: z.string(),
    })
    .optional(),
});

export type OrderItemWithProduct = z.infer<typeof OrderItemWithProductSchema>;
// Prices are resolved by the server from the catalog; client-supplied prices are not accepted.
export const CreateOrderItemSchema = z
  .object({
    itemId: z.number().int().positive(),
    discount: z.number().nonnegative().default(0),
    discountType: z.enum(DiscountType).default(DiscountType.PERCENT),
    specialRequest: z.string().nullable().default(null),
    allergies: z.array(z.enum(Allergy)).default([]),
  })
  .refine(item => isValidDiscount(item.discount, item.discountType), {
    message: DISCOUNT_RANGE_MESSAGE,
    path: ['discount'],
  });

export const CreateGuestItemsSchema = z.object({
  guestNumber: z.number().int().positive(),
  items: z.array(CreateOrderItemSchema),
});

export type CreateGuestItems = z.infer<typeof CreateGuestItemsSchema>;
