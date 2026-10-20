import { apiRequest } from '@/shared/utils/apiRequest';
import {
	OrderCreate,
	OrderMetaDto,
	OrderQuery,
	OrderSearchResultDto,
	OrderUpdateItems,
	OrderUpdate,
} from '@servemate/shared-dto';
import { orderEndpoints } from './endpoints';

export type OrderApiClient = {
	getOrders: (params?: OrderQuery) => Promise<OrderSearchResultDto>;
	getMeta: (params?: OrderQuery) => Promise<OrderMetaDto>;
	createOrder: (body: OrderCreate) => Promise<void>;
	updateOrderItems: (id: string, body: OrderUpdateItems) => Promise<void>;
	updateOrderProperties: (id: string, body: OrderUpdate) => Promise<void>;
	printOrderItems: (id: string) => Promise<void>;
	callOrderItems: (id: string) => Promise<void>;
	deleteOrder: (id: string) => Promise<void>;
};

const requestVoid = async <TBody>(
	endpoint: string,
	options: { method: 'POST' | 'PATCH' | 'DELETE'; body?: TBody },
): Promise<void> => {
	await apiRequest<null, TBody>(endpoint, {
		method: options.method,
		body: options.body,
		responseMode: 'void',
	});
};

export const orderApiClient: OrderApiClient = {
	getOrders: (params) =>
		apiRequest<OrderSearchResultDto>(orderEndpoints.list, {
			params,
			responseMode: 'json',
		}),
	getMeta: (params) =>
		apiRequest<OrderMetaDto>(orderEndpoints.meta, {
			params,
			responseMode: 'json',
		}),
	createOrder: async (body) => {
		await requestVoid<OrderCreate>(orderEndpoints.create, {
			method: 'POST',
			body,
		});
	},
	updateOrderItems: async (id, body) => {
		await requestVoid<OrderUpdateItems>(orderEndpoints.updateItems(id), {
			method: 'PATCH',
			body,
		});
	},
	updateOrderProperties: async (id, body) => {
		await requestVoid<OrderUpdate>(orderEndpoints.update(id), {
			method: 'PATCH',
			body,
		});
	},
	printOrderItems: async (id) => {
		await requestVoid(orderEndpoints.printItems(id), { method: 'POST' });
	},
	callOrderItems: async (id) => {
		await requestVoid(orderEndpoints.callItems(id), { method: 'POST' });
	},
	deleteOrder: async (id) => {
		await requestVoid(orderEndpoints.delete(id), { method: 'DELETE' });
	},
};
