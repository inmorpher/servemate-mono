'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { UserListResponse, UserQueryDto } from '@servemate/shared-dto';
import { UseQueryResult } from '@tanstack/react-query';

export type UseGetUsersReturn = UseQueryResult<UserListResponse> & {
	userSearchCriteria: UserQueryDto;
};

export const useGetUsers = (
	userSearchCriteria: Partial<UserQueryDto> = {},
): UseGetUsersReturn => {
	const usersData = useApiQuery<UserListResponse>('/users', userSearchCriteria, {
		queryKeyScope: 'users',
		refetchOnWindowFocus: false,
	});

	return {
		...usersData,
		userSearchCriteria: userSearchCriteria as UserQueryDto,
	};
};
