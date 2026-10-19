export const orderEndpoints = {
	list: '/orders',
	create: '/orders',
	meta: '/orders/meta',
	detail: (id: string) => `/orders/${id}`,
	update: (id: string) => `/orders/${id}`,
	delete: (id: string) => `/orders/${id}`,
	updateItems: (id: string) => `/orders/${id}/items`,
	printItems: (id: string) => `/orders/${id}/print`,
	callItems: (id: string) => `/orders/${id}/call`,
};
