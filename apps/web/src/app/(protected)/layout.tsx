import { workspaceQueryKey } from '@/features/workspace/api/client';
import { getWorkspaceBootstrapOnServer } from '@/features/workspace/api/server';
import type { WorkspaceBootstrap } from '@/features/workspace/types';
import { TabsProvider } from '@/shared/components/tabs/TabsProvider';
import { buildApiQueryKey } from '@/shared/utils/buildApiQueryKey';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import ProtectedShell from './ProtectedShell';

const loadWorkspace = async (): Promise<WorkspaceBootstrap | null> => {
	try {
		return await getWorkspaceBootstrapOnServer();
	} catch (error) {
		// The app stays usable without a persisted workspace.
		console.error('Failed to load workspace bootstrap', error);
		return null;
	}
};

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
	const bootstrap = await loadWorkspace();
	const queryClient = new QueryClient();

	if (bootstrap) {
		queryClient.setQueryData(workspaceQueryKey, bootstrap);

		if (bootstrap.activeTab && bootstrap.activeTabData !== undefined) {
			queryClient.setQueryData(
				buildApiQueryKey(bootstrap.activeTab.type, bootstrap.activeTab.state),
				bootstrap.activeTabData,
			);
		}
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TabsProvider initialWorkspace={bootstrap?.workspace ?? null}>
				<ProtectedShell isWorkspaceLoaded={bootstrap !== null}>{children}</ProtectedShell>
			</TabsProvider>
		</HydrationBoundary>
	);
};

export default ProtectedLayout;
