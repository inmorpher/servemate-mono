import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiRequest } from '../utils/apiRequest';
import { buildApiQueryKey } from '../utils/buildApiQueryKey';

export type ApiQueryOptions<TData> = Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> & {
	queryKeyScope?: string;
};

/**
 * useApiQuery
 *
 * A convenience React Query hook to fetch JSON data from the API and cache results.
 *
 * @template TData - The expected shape of the JSON response.
 *
 * @param endpoint - The API endpoint path (passed to buildApiUrl). This, together with `params`, is used to form the query key.
 * @param params - Optional query parameters used to build the request URL. These should be serializable and stable (avoid non-primitive or inline objects) because they are included in the query key.
 * @param options - Additional query options. `queryKeyScope` lets a workspace tab share its cache key with bootstrap data.
 *
 * @returns UseQueryResult<TData, Error> - The react-query result containing status flags, the parsed JSON data typed as TData, any thrown error, and utility methods like refetch.
 *
 * @remarks
 * - Internally constructs the request URL via buildApiUrl(endpoint, params) and performs a fetch().
 * - If the HTTP response is not ok, the hook throws an Error('Failed to fetch data').
 * - The response body is parsed as JSON and returned as TData.
 * - The query key is [queryKeyScope ?? endpoint, serialized params].
 * - The hook uses keepPreviousData as placeholderData to keep previous results visible while a refetch is in progress (helps avoid UI flicker).
 *
 * @throws Error - When the fetch response is not ok.
 *
 * @example
 * // Fetch a list of users
 * const { data, isLoading, error } = useApiQuery<User[]>('/users', { active: true }, { staleTime: 60000 });
 */
export const useApiQuery = <TData = unknown>(
	endpoint: string,
	params?: Record<string, unknown>,
	options?: ApiQueryOptions<TData>,
) => {
	const { queryKeyScope = endpoint, ...queryOptions } = options ?? {};

	return useQuery({
		queryKey: buildApiQueryKey(queryKeyScope, params),
		queryFn: async () => apiRequest<TData>(endpoint, { params, responseMode: 'json' }),
		placeholderData: keepPreviousData,
		staleTime: 5 * 60 * 1000, //default 5 minutes
		...queryOptions,
	});
};
