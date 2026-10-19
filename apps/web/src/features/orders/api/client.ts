import { apiRequest } from '@/shared/utils/apiRequest';
import {
	OrderCreateDTO,
	OrderMetaDTO,
	OrderSearchCriteria,
	OrderSearchListResult,
	OrderUpdateItems,
	OrderUpdateProps,
} from '@servemate/dto';
import { orderEndpoints } from './endpoints';

export type OrderApiClient = {
	getOrders: (params?: OrderSearchCriteria) => Promise<OrderSearchListResult>;
	getMeta: (params?: OrderSearchCriteria) => Promise<OrderMetaDTO>;
	createOrder: (body: OrderCreateDTO) => Promise<void>;
	updateOrderItems: (id: string, body: OrderUpdateItems) => Promise<void>;
	updateOrderProperties: (id: string, body: OrderUpdateProps) => Promise<void>;
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
		apiRequest<OrderSearchListResult>(orderEndpoints.list, {
			params,
			responseMode: 'json',
		}),
	getMeta: (params) =>
		apiRequest<OrderMetaDTO>(orderEndpoints.meta, {
			params,
			responseMode: 'json',
		}),
	createOrder: async (body) => {
		await requestVoid<OrderCreateDTO>(orderEndpoints.create, {
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
		await requestVoid<OrderUpdateProps>(orderEndpoints.update(id), {
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
