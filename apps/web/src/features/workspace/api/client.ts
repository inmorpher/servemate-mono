import { apiRequest } from '@/shared/utils/apiRequest';
import type { WorkspaceBootstrap, WorkspaceUpdate, WorkspaceUpdateResponse } from '../types';

export const workspaceQueryKey = ['workspace', 'bootstrap'] as const;
export const workspaceMutationKey = ['workspace', 'update'] as const;

export const workspaceApiClient = {
	getBootstrap: () =>
		apiRequest<WorkspaceBootstrap>('/workspace/bootstrap', { responseMode: 'json' }),
	update: (body: WorkspaceUpdate) =>
		apiRequest<WorkspaceUpdateResponse, WorkspaceUpdate>('/workspace', {
			method: 'PUT',
			body,
			responseMode: 'json',
		}),
};
