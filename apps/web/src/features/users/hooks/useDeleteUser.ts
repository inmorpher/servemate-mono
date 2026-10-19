'use client';

import { UserListResult } from '@servemate/dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApiClient } from '../api';

export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		onMutate: async ({ id }: { id: string }) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });

			const previousUserQueries = queryClient.getQueriesData<UserListResult>({
				queryKey: ['users'],
			});

			queryClient.setQueriesData<UserListResult>({ queryKey: ['users'] }, (currentData) => {
				if (!currentData?.users) {
					return currentData;
				}

				const nextUsers = currentData.users.filter((user) => String(user.id) !== id);

				if (nextUsers.length === currentData.users.length) {
					return currentData;
				}

				return {
					...currentData,
					users: nextUsers,
					totalCount:
						typeof currentData.totalCount === 'number'
							? Math.max(0, currentData.totalCount - 1)
							: currentData.totalCount,
				};
			});

			return { previousUserQueries };
		},
		mutationFn: ({ id }: { id: string }) => usersApiClient.deleteUser(id),
		onError: (_error, _variables, context) => {
			context?.previousUserQueries?.forEach(([queryKey, queryData]) => {
				queryClient.setQueryData(queryKey, queryData);
			});
		},
		onSettled: () => {
			void queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};
