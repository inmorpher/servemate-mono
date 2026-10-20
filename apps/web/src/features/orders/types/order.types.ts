import type {
	OrderListItemDto,
	OrderSearchResultDto,
	OrderState,
} from '@servemate/shared-dto';

export type Order = OrderListItemDto;
export type OrdersResponse = OrderSearchResultDto;
export type OrderStatus = OrderState;

export type OrderListItem = Order;
