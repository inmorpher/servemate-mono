import { buildQueryParams } from './buildQueryParams';

export const buildApiQueryKey = (scope: string, params?: Record<string, unknown>) =>
	[scope, buildQueryParams(params ?? {})] as const;
