export const API_BASE_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';
console.log('API_BASE_URL:', API_BASE_URL);
export const API_ENDPOINTS = {
	Users: `/api/service/users`,

	// ORDERS
	OrdersActions: {
		create: '/orders',
		update: '/orders/:id',
		delete: '/orders/:id',
		meta: '/orders/meta',
		list: '/orders',
	},
};
