import { apiRequest } from '@/shared/utils/apiRequest';

import {
	CreateUserDto,
	UpdateUserDto,
	UserListItem,
	UserListResult,
	UserSearchCriteria,
} from '@servemate/dto';

import { usersEndpoints } from './endpoints';

export type UsersApiClient = {
	getUsers: (params?: UserSearchCriteria) => Promise<UserListResult>;
	getUser: (id: string) => Promise<UserListItem>;
	createUser: (body: CreateUserDto) => Promise<void>;
	updateUser: (id: string, body: UpdateUserDto) => Promise<void>;
	deleteUser: (id: string) => Promise<void>;
};

const requestVoid = async <TBody = unknown>(
	endpoint: string,
	options: { method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: TBody },
): Promise<void> => {
	await apiRequest<null, TBody>(endpoint, {
		method: options.method,
		body: options.body,
		responseMode: 'void',
	});
};

export const usersApiClient: UsersApiClient = {
	getUsers: (params) =>
		apiRequest<UserListResult>(usersEndpoints.list, {
			params,
			responseMode: 'json',
		}),
	getUser: (id) =>
		apiRequest<UserListItem>(usersEndpoints.detail(id), {
			responseMode: 'json',
		}),
	createUser: async (body) => {
		await requestVoid<CreateUserDto>(usersEndpoints.list, {
			method: 'POST',
			body,
		});
	},
	updateUser: async (id, body) => {
		await requestVoid<UpdateUserDto>(usersEndpoints.detail(id), {
			method: 'PUT',
			body,
		});
	},
	deleteUser: async (id) => {
		await requestVoid(usersEndpoints.delete(id), { method: 'DELETE' });
	},
};
