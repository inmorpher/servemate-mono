import { Allergy, DiscountType, OrderState, PaymentState } from '@prisma/client';

import {
  OrderMetaDto,
  OrderQuery,
  OrderResponseDto,
  OrderSearchResultDto,
  OrderUpdate,
} from '@servemate/shared-dto';

export interface OrderItemCreateData {
  guestNumber: number;
  itemId: number;
  price: number;
  discount: number;
  discountType: DiscountType;
  finalPrice: number;
  specialRequest: string | null;
  allergies: Allergy[];
  printed?: boolean;
  fired?: boolean;
  paymentStatus?: PaymentState;
}

export interface OrderCreateData {
  tableNumber: number;
  guestsCount: number;
  serverId: number;
  status: OrderState;
  comments?: string | null;
  discount: number;
  discountType: DiscountType;
  totalAmount: number;
  foodItems: OrderItemCreateData[];
  drinkItems: OrderItemCreateData[];
}

export interface OrderItemsUpdateData {
  totalAmount: number;
  foodItems: OrderItemCreateData[];
  drinkItems: OrderItemCreateData[];
}

export interface OrderUpdateData extends OrderUpdate {
  totalAmount?: number;
}

export interface CatalogPrices {
  foodPrices: Map<number, number>;
  drinkPrices: Map<number, number>;
}

export interface IOrdersRepository {
  findOrders(criteria: OrderQuery): Promise<OrderSearchResultDto>;
  findById(orderId: number): Promise<OrderResponseDto | null>;
  getMeta(criteria: OrderQuery): Promise<OrderMetaDto>;
  findCatalogPrices(foodIds: number[], drinkIds: number[]): Promise<CatalogPrices>;

  create(data: OrderCreateData): Promise<OrderResponseDto>;

  update(orderId: number, data: OrderUpdateData): Promise<OrderResponseDto>;

  updateItems(
    orderId: number,
    data: OrderItemsUpdateData
  ): Promise<OrderResponseDto>;

  printItems(orderId: number, ids: number[]): Promise<void>;
  callItems(orderId: number, ids: number[]): Promise<void>;
  delete(orderId: number): Promise<void>;
}
