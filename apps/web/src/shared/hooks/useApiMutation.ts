import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { ApiResponseMode, apiRequest } from '../utils/apiRequest';

type UseApiMutationOptions<TData, TVariables> = Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'> & {
	responseMode?: ApiResponseMode;
	params?: Record<string, unknown>;
};

type ApiMutationVariables<TBody> = {
	body?: TBody;
	params?: Record<string, unknown>;
	responseMode?: ApiResponseMode;
};

export const useApiMutation = <TData = unknown, TBody = unknown>(
	endpoint: string,
	method: string,
	options?: UseApiMutationOptions<TData, ApiMutationVariables<TBody>>,
): UseMutationResult<TData, Error, ApiMutationVariables<TBody>> => {
	const { responseMode = 'auto', params: defaultParams, ...mutationOptions } = options ?? {};

	return useMutation({
		mutationFn: async (variables) => {
			const { body, params, responseMode: requestResponseMode } = variables ?? {};

			return apiRequest<TData, TBody>(endpoint, {
				method,
				params: params ?? defaultParams,
				body,
				responseMode: requestResponseMode ?? responseMode,
			});
		},
		...mutationOptions,
	});
};