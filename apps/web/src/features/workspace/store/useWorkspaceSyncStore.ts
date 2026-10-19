'use client';

import { create } from 'zustand';

export type WorkspaceSyncStatus = 'idle' | 'pending' | 'syncing' | 'synced' | 'error';

interface WorkspaceSyncState {
	status: WorkspaceSyncStatus;
	lastSyncedAt?: number;
	retry: (() => void | Promise<void>) | null;
	setStatus: (status: WorkspaceSyncStatus) => void;
	markSynced: (timestamp: number) => void;
	setRetry: (retry: (() => void | Promise<void>) | null) => void;
}

export const useWorkspaceSyncStore = create<WorkspaceSyncState>((set) => ({
	status: 'idle',
	lastSyncedAt: undefined,
	retry: null,
	setStatus: (status) => set({ status }),
	markSynced: (lastSyncedAt) => set({ status: 'synced', lastSyncedAt }),
	setRetry: (retry) => set({ retry }),
}));
