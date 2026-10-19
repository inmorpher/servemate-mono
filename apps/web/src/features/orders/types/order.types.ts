import type { paths } from '@/shared/api/api-types';

export type Order =
	paths['/api/orders']['get']['responses']['200']['content']['application/json']['orders'][number];
export type OrdersResponse =
	paths['/api/orders']['get']['responses']['200']['content']['application/json'];
export type OrderStatus = NonNullable<Order['status']>;

export interface OrderListItem extends Order {}
