import { Allergy, OrderState } from '@prisma/client';
import { OrderCreateSchema } from '@servemate/shared-dto';
import { OrderQuerySchema } from '@servemate/shared-dto';
import {
  OrderUpdateItemsSchema,
  OrderUpdateSchema,
} from '@servemate/shared-dto';

describe('Orders DTO schemas', () => {
  it('parses a singular tableNumber query parameter', () => {
    expect(OrderQuerySchema.parse({ tableNumber: '43' })).toEqual(
      expect.objectContaining({ tableNumber: 43 })
    );
  });

  it('parses a comma-separated tableNumbers query parameter', () => {
    expect(OrderQuerySchema.parse({ tableNumbers: '43,44' })).toEqual(
      expect.objectContaining({ tableNumbers: [43, 44] })
    );
  });

  it('normalizes query status and allergies', () => {
    expect(
      OrderQuerySchema.parse({
        status: 'completed',
        allergies: 'gluten,dairy',
      })
    ).toEqual(
      expect.objectContaining({
        status: OrderState.COMPLETED,
        allergies: [Allergy.GLUTEN, Allergy.DAIRY],
      })
    );
  });

  it('rejects an order without food or drink items', () => {
    expect(() =>
      OrderCreateSchema.parse({
        tableNumber: 43,
        guestsCount: 2,
        serverId: 7,
        foodItems: [],
        drinkItems: [],
      })
    ).toThrow();
  });

  it('strips client-supplied prices from create items', () => {
    const parsed = OrderCreateSchema.parse({
      tableNumber: 43,
      guestsCount: 1,
      serverId: 7,
      foodItems: [
        {
          guestNumber: 1,
          items: [{ itemId: 100, price: 0, finalPrice: 0 }],
        },
      ],
      drinkItems: [],
    });

    expect(parsed.foodItems[0].items[0]).toEqual({
      itemId: 100,
      discount: 0,
      specialRequest: null,
      allergies: [],
    });
  });

  it('rejects item discounts above 100 percent', () => {
    expect(() =>
      OrderCreateSchema.parse({
        tableNumber: 43,
        guestsCount: 1,
        serverId: 7,
        foodItems: [
          {
            guestNumber: 1,
            items: [{ itemId: 100, discount: 150 }],
          },
        ],
        drinkItems: [],
      })
    ).toThrow();
  });

  it('rejects an empty property update', () => {
    expect(() => OrderUpdateSchema.parse({})).toThrow();
  });

  it('rejects an empty item update', () => {
    expect(() =>
      OrderUpdateItemsSchema.parse({ foodItems: [], drinkItems: [] })
    ).toThrow();
  });
});
