'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { UserListResult, UserSearchCriteria } from '@servemate/dto';
import { UseQueryResult } from '@tanstack/react-query';

export type UseGetUsersReturn = UseQueryResult<UserListResult> & {
	userSearchCriteria: UserSearchCriteria;
};

export const useGetUsers = (
	userSearchCriteria: Partial<UserSearchCriteria> = {},
): UseGetUsersReturn => {
	const usersData = useApiQuery<UserListResult>('/users', userSearchCriteria, {
		queryKeyScope: 'users',
		refetchOnWindowFocus: false,
	});

	return {
		...usersData,
		userSearchCriteria: userSearchCriteria as UserSearchCriteria,
	};
};
