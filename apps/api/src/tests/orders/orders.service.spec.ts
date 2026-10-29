import { Allergy, OrderState, PaymentState } from '@prisma/client';
import { HTTPError } from '../../errors/http-error.class';
import {
  OrderCreate,
  OrderResponseDto,
  OrderUpdateItems,
} from '@servemate/shared-dto';
import { IOrdersRepository } from '../../orders/orders.repository.interface';
import { OrdersService } from '../../orders/orders.service';

const repositoryMock = (): jest.Mocked<IOrdersRepository> =>
  ({
    findOrders: jest.fn(),
    findById: jest.fn(),
    getMeta: jest.fn(),
    findCatalogPrices: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateItems: jest.fn(),
    printItems: jest.fn(),
    callItems: jest.fn(),
    delete: jest.fn(),
  }) as jest.Mocked<IOrdersRepository>;

const responseOrder = (
  overrides: Partial<OrderResponseDto> = {}
): OrderResponseDto => ({
  id: 10,
  tableNumber: 43,
  guestsCount: 2,
  orderTime: new Date('2026-01-01T10:00:00.000Z'),
  updatedAt: new Date('2026-01-01T10:00:00.000Z'),
  serverId: 7,
  status: OrderState.RECEIVED,
  comments: null,
  completionTime: null,
  totalAmount: 18,
  discount: 10,
  tip: 0,
  shiftId: null,
  allergies: [],
  server: { id: 7, name: 'Server' },
  foodItems: [
    {
      guestNumber: 1,
      items: [
        {
          id: 1,
          itemId: 100,
          guestNumber: 1,
          allergies: [Allergy.GLUTEN],
          price: 10,
          discount: 0,
          finalPrice: 10,
          printed: false,
          fired: false,
          paymentStatus: PaymentState.NONE,
          specialRequest: null,
          name: 'Soup',
        },
      ],
    },
  ],
  drinkItems: [],
  ...overrides,
});

describe('OrdersService', () => {
  let repository: jest.Mocked<IOrdersRepository>;
  let service: OrdersService;

  beforeEach(() => {
    repository = repositoryMock();
    service = new OrdersService(repository);
  });

  it('prices items from the catalog and computes the discounted total', async () => {
    const data: OrderCreate = {
      tableNumber: 43,
      guestsCount: 2,
      serverId: 7,
      status: OrderState.RECEIVED,
      comments: null,
      discount: 10,
      allergies: [],
      foodItems: [
        {
          guestNumber: 2,
          items: [
            {
              itemId: 100,
              discount: 0,
              specialRequest: null,
              allergies: [],
            },
          ],
        },
      ],
      drinkItems: [
        {
          guestNumber: 1,
          items: [
            {
              itemId: 200,
              discount: 50,
              specialRequest: null,
              allergies: [],
            },
          ],
        },
      ],
    };
    repository.findCatalogPrices.mockResolvedValue({
      foodPrices: new Map([[100, 20]]),
      drinkPrices: new Map([[200, 8]]),
    });
    const created = responseOrder({ totalAmount: 21.6 });
    repository.create.mockResolvedValue(created);

    await expect(service.createOrder(data)).resolves.toBe(created);

    expect(repository.findCatalogPrices).toHaveBeenCalledWith([100], [200]);
    expect(repository.create).toHaveBeenCalledWith({
      tableNumber: 43,
      guestsCount: 2,
      serverId: 7,
      status: OrderState.RECEIVED,
      comments: null,
      discount: 10,
      totalAmount: 21.6,
      foodItems: [
        {
          itemId: 100,
          price: 20,
          discount: 0,
          finalPrice: 20,
          specialRequest: null,
          allergies: [],
          guestNumber: 2,
        },
      ],
      drinkItems: [
        {
          itemId: 200,
          price: 8,
          discount: 50,
          finalPrice: 4,
          specialRequest: null,
          allergies: [],
          guestNumber: 1,
        },
      ],
    });
  });

  it('rejects an order containing an item missing from the catalog', async () => {
    repository.findCatalogPrices.mockResolvedValue({
      foodPrices: new Map(),
      drinkPrices: new Map(),
    });

    await expect(
      service.createOrder({
        tableNumber: 43,
        guestsCount: 1,
        serverId: 7,
        status: OrderState.RECEIVED,
        comments: null,
        discount: 0,
        allergies: [],
        foodItems: [
          {
            guestNumber: 1,
            items: [
              {
                itemId: 999,
                discount: 0,
                specialRequest: null,
                allergies: [],
              },
            ],
          },
        ],
        drinkItems: [],
      })
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('recalculates the stored total when the discount changes', async () => {
    repository.findById.mockResolvedValue(responseOrder());
    repository.update.mockResolvedValue(
      responseOrder({ discount: 50, totalAmount: 5 })
    );

    await service.updateOrder(10, { discount: 50 });

    expect(repository.update).toHaveBeenCalledWith(10, {
      discount: 50,
      totalAmount: 5,
    });
  });

  it('updates order properties through the repository', async () => {
    const data = { status: OrderState.SERVED };
    const updated = responseOrder({ status: OrderState.SERVED });
    repository.update.mockResolvedValue(updated);

    await expect(service.updateOrder(10, data)).resolves.toBe(updated);
    expect(repository.update).toHaveBeenCalledWith(10, data);
  });

  it('keeps stored prices and prices only new items from the catalog', async () => {
    const data: OrderUpdateItems = {
      foodItems: [
        {
          guestNumber: 2,
          items: [
            {
              itemId: 101,
              discount: 0,
              specialRequest: 'No salt',
              allergies: [],
            },
          ],
        },
      ],
      drinkItems: [],
    };
    const updated = responseOrder({ totalAmount: 16.2 });
    repository.findById.mockResolvedValue(responseOrder());
    repository.findCatalogPrices.mockResolvedValue({
      foodPrices: new Map([[101, 8]]),
      drinkPrices: new Map(),
    });
    repository.updateItems.mockResolvedValue(updated);

    await expect(service.updateOrderItems(10, data)).resolves.toBe(updated);

    expect(repository.findCatalogPrices).toHaveBeenCalledWith([101], []);
    expect(repository.updateItems).toHaveBeenCalledWith(10, {
      totalAmount: 16.2,
      foodItems: [
        expect.objectContaining({ id: 1, guestNumber: 1, finalPrice: 10 }),
        expect.objectContaining({
          itemId: 101,
          guestNumber: 2,
          price: 8,
          finalPrice: 8,
          specialRequest: 'No salt',
        }),
      ],
      drinkItems: [],
    });
  });

  it('throws 404 when updating items for a missing order', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.updateOrderItems(999, { foodItems: [], drinkItems: [] })
    ).rejects.toMatchObject({ statusCode: 404 });
    expect(repository.updateItems).not.toHaveBeenCalled();
  });

  it('delegates print, call and delete operations', async () => {
    await expect(service.printOrderItems(10, [1, 2])).resolves.toBe(
      'Items have been printed'
    );
    await expect(service.callOrderItems(10, [1, 2])).resolves.toBe(
      'Items 1, 2 have been called'
    );
    await expect(service.deleteOrder(10)).resolves.toBeUndefined();

    expect(repository.printItems).toHaveBeenCalledWith(10, [1, 2]);
    expect(repository.callItems).toHaveBeenCalledWith(10, [1, 2]);
    expect(repository.delete).toHaveBeenCalledWith(10);
  });

  it('converts repository failures into HTTPError', async () => {
    repository.findOrders.mockRejectedValue(new Error('database down'));

    await expect(service.findOrders({} as never)).rejects.toBeInstanceOf(
      HTTPError
    );
  });
});
