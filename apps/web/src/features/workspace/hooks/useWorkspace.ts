'use client';

import { ApiRequestError } from '@/shared/utils/apiRequest';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workspaceApiClient, workspaceMutationKey, workspaceQueryKey } from '../api/client';
import type { WorkspaceBootstrap, WorkspaceUpdate, WorkspaceUpdateResponse } from '../types';

export type WorkspaceSaveInput = Omit<WorkspaceUpdate, 'expectedVersion'>;

export const useWorkspaceBootstrap = () =>
	useQuery<WorkspaceBootstrap>({
		queryKey: workspaceQueryKey,
		queryFn: workspaceApiClient.getBootstrap,
		staleTime: 60_000,
		refetchOnWindowFocus: false,
	});

export const useUpdateWorkspace = () => {
	const queryClient = useQueryClient();

	return useMutation<WorkspaceUpdateResponse, ApiRequestError, WorkspaceSaveInput>({
		mutationKey: workspaceMutationKey,
		mutationFn: (body: WorkspaceSaveInput) => {
			const currentWorkspace =
				queryClient.getQueryData<WorkspaceBootstrap>(workspaceQueryKey);

			return workspaceApiClient.update({
				...body,
				expectedVersion: currentWorkspace?.workspace.version ?? 0,
			});
		},
		scope: { id: 'workspace-update' },
		onSuccess: (workspace) => {
			queryClient.setQueryData<WorkspaceBootstrap>(workspaceQueryKey, (current) =>
				current ? { ...current, workspace: { ...workspace } } : current,
			);
		},
		onError: (error) => {
			if (error.status === 409) {
				void queryClient.refetchQueries({ queryKey: workspaceQueryKey });
			}
		},
	});
};
