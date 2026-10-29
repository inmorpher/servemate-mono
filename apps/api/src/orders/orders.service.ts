import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseService } from '../common/base.service';
import { HTTPError } from '../errors/http-error.class';
import { TYPES } from '../types';
import { publishRealtimeEvent } from '../websocket/realtime-event';
import { IWebSocketService } from '../websocket/websocket.service.interface';
import {
  CreateGuestItems,
  OrderCreate,
  OrderMetaDto,
  OrderQuery,
  OrderResponseDto,
  OrderSearchResultDto,
  OrderUpdate,
  OrderUpdateItems,
} from '@servemate/shared-dto';
import { IOrdersRepository } from './orders.repository.interface';
import { IOrdersService } from './orders.service.interface';

const roundMoney = (value: number): number => Number(value.toFixed(2));

const calculateTotal = (
  items: { finalPrice: number }[],
  discount: number
): number =>
  roundMoney(
    items.reduce((sum, item) => sum + item.finalPrice, 0) *
      (1 - discount / 100)
  );

const flattenGuestItems = (guests: CreateGuestItems[]) =>
  guests.flatMap(guest =>
    guest.items.map(item => ({ ...item, guestNumber: guest.guestNumber }))
  );

@injectable()
export class OrdersService extends BaseService implements IOrdersService {
  protected serviceName = 'OrdersService';

  constructor(
    @inject(TYPES.OrdersRepository) private ordersRepository: IOrdersRepository,
    @inject(TYPES.WebSocketService)
    private readonly realtimeGateway?: IWebSocketService
  ) {
    super();
  }

  private async findExistingOrder(orderId: number): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new HTTPError(
        404,
        this.serviceName,
        'Order not found',
        `/orders/${orderId}`
      );
    }
    return order;
  }

  // Prices come from the catalog, never from the client. The item discount is a percentage.
  private async priceNewItems(
    foodGuests: CreateGuestItems[],
    drinkGuests: CreateGuestItems[]
  ) {
    const foodInputs = flattenGuestItems(foodGuests);
    const drinkInputs = flattenGuestItems(drinkGuests);
    const catalog = await this.ordersRepository.findCatalogPrices(
      [...new Set(foodInputs.map(item => item.itemId))],
      [...new Set(drinkInputs.map(item => item.itemId))]
    );

    return {
      foodItems: foodInputs.map(item =>
        this.priceItem(item, catalog.foodPrices)
      ),
      drinkItems: drinkInputs.map(item =>
        this.priceItem(item, catalog.drinkPrices)
      ),
    };
  }

  private priceItem<T extends { itemId: number; discount: number }>(
    item: T,
    catalogPrices: Map<number, number>
  ) {
    const price = catalogPrices.get(item.itemId);
    if (price === undefined) {
      throw new HTTPError(
        400,
        this.serviceName,
        `Item ${item.itemId} does not exist in the catalog`,
        '/orders'
      );
    }
    return {
      ...item,
      price,
      finalPrice: roundMoney(price * (1 - item.discount / 100)),
    };
  }

  async findOrders(criteria: OrderQuery): Promise<OrderSearchResultDto> {
    try {
      return await this.ordersRepository.findOrders(criteria);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async findOrderById(orderId: number): Promise<OrderResponseDto | null> {
    try {
      return await this.ordersRepository.findById(orderId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrderMeta(criteria: OrderQuery): Promise<OrderMetaDto> {
    try {
      return await this.ordersRepository.getMeta(criteria);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createOrder(data: OrderCreate): Promise<OrderResponseDto> {
    try {
      const { foodItems, drinkItems } = await this.priceNewItems(
        data.foodItems,
        data.drinkItems
      );
      const totalAmount = calculateTotal(
        [...foodItems, ...drinkItems],
        data.discount
      );

      const order = await this.ordersRepository.create({
        tableNumber: data.tableNumber,
        guestsCount: data.guestsCount,
        serverId: data.serverId,
        status: data.status,
        comments: data.comments,
        discount: data.discount,
        totalAmount,
        foodItems,
        drinkItems,
      });
      publishRealtimeEvent(
        this.realtimeGateway,
        'orders',
        'created',
        order.id,
        order
      );
      return order;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateOrder(
    orderId: number,
    data: OrderUpdate
  ): Promise<OrderResponseDto> {
    try {
      let totalAmount: number | undefined;
      if (data.discount !== undefined) {
        const currentOrder = await this.findExistingOrder(orderId);
        totalAmount = calculateTotal(
          [
            ...currentOrder.foodItems.flatMap(guest => guest.items),
            ...currentOrder.drinkItems.flatMap(guest => guest.items),
          ],
          data.discount
        );
      }

      const order = await this.ordersRepository.update(orderId, {
        ...data,
        ...(totalAmount !== undefined && { totalAmount }),
      });
      publishRealtimeEvent(
        this.realtimeGateway,
        'orders',
        'updated',
        order.id,
        order
      );
      return order;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateOrderItems(
    orderId: number,
    data: OrderUpdateItems
  ): Promise<OrderResponseDto> {
    try {
      const currentOrder = await this.findExistingOrder(orderId);
      const newItems = await this.priceNewItems(data.foodItems, data.drinkItems);

      const foodItems = [
        ...currentOrder.foodItems.flatMap(guest => guest.items),
        ...newItems.foodItems,
      ];
      const drinkItems = [
        ...currentOrder.drinkItems.flatMap(guest => guest.items),
        ...newItems.drinkItems,
      ];

      const totalAmount = calculateTotal(
        [...foodItems, ...drinkItems],
        currentOrder.discount
      );

      const order = await this.ordersRepository.updateItems(orderId, {
        totalAmount,
        foodItems,
        drinkItems,
      });
      publishRealtimeEvent(
        this.realtimeGateway,
        'orders',
        'items_updated',
        order.id,
        order
      );
      return order;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async printOrderItems(orderId: number, ids: number[]): Promise<string> {
    try {
      await this.ordersRepository.printItems(orderId, ids);
      publishRealtimeEvent(
        this.realtimeGateway,
        'orders',
        'items_printed',
        orderId,
        {
          itemIds: ids,
        }
      );
      return 'Items have been printed';
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async callOrderItems(orderId: number, ids: number[]): Promise<string> {
    try {
      await this.ordersRepository.callItems(orderId, ids);
      publishRealtimeEvent(
        this.realtimeGateway,
        'orders',
        'items_called',
        orderId,
        {
          itemIds: ids,
        }
      );
      return `Items ${ids.join(', ')} have been called`;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteOrder(orderId: number): Promise<void> {
    try {
      await this.ordersRepository.delete(orderId);
      publishRealtimeEvent(this.realtimeGateway, 'orders', 'deleted', orderId);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
