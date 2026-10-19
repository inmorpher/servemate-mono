import { CONFIG } from '@/app/api/service/[...params]/config';
import {
	forceRefreshToken,
	getValidatedTokenFromSession,
} from '@/app/api/service/[...params]/token-utils';
import type { Workspace, WorkspaceBootstrap } from '../types';

export const getWorkspaceBootstrapOnServer = async (): Promise<WorkspaceBootstrap> => {
	let { accessToken } = await getValidatedTokenFromSession();

	const fetchWorkspaceEndpoint = (token: string, endpoint: 'workspace' | 'workspace/bootstrap') =>
		fetch(`${CONFIG.API_BASE_URL}/${endpoint}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		});

	let response = await fetchWorkspaceEndpoint(accessToken, 'workspace/bootstrap');

	if (response.status === 401) {
		const { accessToken: refreshedAccessToken } = await forceRefreshToken();
		accessToken = refreshedAccessToken;
		response = await fetchWorkspaceEndpoint(accessToken, 'workspace/bootstrap');
	}

	if (response.ok) {
		return response.json() as Promise<WorkspaceBootstrap>;
	}

	if (response.status >= 500) {
		const workspaceResponse = await fetchWorkspaceEndpoint(accessToken, 'workspace');

		if (workspaceResponse.ok) {
			const workspace = (await workspaceResponse.json()) as Workspace;
			return { workspace };
		}

		throw new Error(
			`Failed to fetch workspace bootstrap (${response.status}); workspace fallback failed (${workspaceResponse.status})`,
		);
	}

	throw new Error(`Failed to fetch workspace bootstrap (${response.status})`);
};
