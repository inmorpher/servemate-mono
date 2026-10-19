'use client';

import { useTabsStoreApi } from '@/shared/components/tabs/store/useTabs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { workspaceApiClient, workspaceQueryKey } from '../api/client';
import { useWorkspaceSyncStore } from '../store/useWorkspaceSyncStore';
import type { WorkspaceBootstrap } from '../types';
import { useUpdateWorkspace, type WorkspaceSaveInput } from './useWorkspace';

const WORKSPACE_SAVE_DELAY = 500;

/** Persists tabs to the server (debounced) whenever the tabs store changes. */
export const useWorkspaceAutosave = (enabled: boolean) => {
	const tabsStore = useTabsStoreApi();
	const queryClient = useQueryClient();
	const { mutate, mutateAsync } = useUpdateWorkspace();
	const setStatus = useWorkspaceSyncStore((state) => state.setStatus);
	const markSynced = useWorkspaceSyncStore((state) => state.markSynced);
	const setRetry = useWorkspaceSyncStore((state) => state.setRetry);

	useEffect(() => {
		if (!enabled) {
			setStatus('error');
			setRetry(() => window.location.reload());
			return () => setRetry(null);
		}

		markSynced(Date.now());
		let timeoutId: number | undefined;

		const buildPayload = (): WorkspaceSaveInput => {
			const { tabs, activeTabId } = tabsStore.getState();
			const cached = queryClient.getQueryData<WorkspaceBootstrap>(workspaceQueryKey);

			return {
				tabs: tabs.map((tab, order) => ({
					id: tab.id,
					title: tab.title,
					type: tab.entity,
					state: tab.filters,
					pinned: tab.pinned,
					order,
				})),
				activeTabId: activeTabId || undefined,
				settings: cached?.workspace.settings ?? {},
			};
		};

		const save = () => {
			setStatus('syncing');
			mutate(buildPayload(), {
				onSuccess: () => markSynced(Date.now()),
				onError: () => setStatus('error'),
			});
		};

		const unsubscribe = tabsStore.subscribe((state, previous) => {
			if (state.tabs === previous.tabs && state.activeTabId === previous.activeTabId) {
				return;
			}

			setStatus('pending');
			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout(save, WORKSPACE_SAVE_DELAY);
		});

		setRetry(async () => {
			setStatus('syncing');
			try {
				// Refresh the cached version first, otherwise the save is rejected with 409
				await queryClient.fetchQuery({
					queryKey: workspaceQueryKey,
					queryFn: workspaceApiClient.getBootstrap,
					staleTime: 0,
				});
				await mutateAsync(buildPayload());
				markSynced(Date.now());
			} catch {
				setStatus('error');
			}
		});

		return () => {
			unsubscribe();
			window.clearTimeout(timeoutId);
			setRetry(null);
		};
	}, [enabled, markSynced, mutate, mutateAsync, queryClient, setRetry, setStatus, tabsStore]);
};
