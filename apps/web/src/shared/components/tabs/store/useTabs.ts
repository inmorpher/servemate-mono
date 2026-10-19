'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { TabsStoreContext } from '../TabsProvider';
import type { TabsStore } from '../types/tabs.type';

export const useTabsStoreApi = () => {
	const store = useContext(TabsStoreContext);

	if (!store) {
		throw new Error('useTabs must be used within TabsProvider');
	}

	return store;
};

export function useTabs(): TabsStore;
export function useTabs<T>(selector: (state: TabsStore) => T): T;
export function useTabs<T>(selector?: (state: TabsStore) => T) {
	const store = useTabsStoreApi();

	return useStore(store, selector ?? ((state) => state as unknown as T));
}
