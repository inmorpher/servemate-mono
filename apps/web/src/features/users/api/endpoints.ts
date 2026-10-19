export const usersEndpoints = {
	list: '/users',
	detail: (id: string) => `/users/${id}`,
	delete: (id: string) => `/users/${id}`,
};
