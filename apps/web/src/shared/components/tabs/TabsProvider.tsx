'use client';

import { createContext, ReactNode, useState } from 'react';
import {
	createTabsStore,
	emptyTabsState,
	workspaceToTabsState,
	type TabsStoreApi,
} from './store/createTabsStore';
import type { WorkspaceTabsInput } from './types/tabs.type';

export const TabsStoreContext = createContext<TabsStoreApi | null>(null);

type TabsProviderProps = {
	children: ReactNode;
	/** Workspace loaded on the server; applied once, on the first render. */
	initialWorkspace: WorkspaceTabsInput | null;
};

export const TabsProvider = ({ children, initialWorkspace }: TabsProviderProps) => {
	const [store] = useState(() =>
		createTabsStore(initialWorkspace ? workspaceToTabsState(initialWorkspace) : emptyTabsState),
	);

	return <TabsStoreContext.Provider value={store}>{children}</TabsStoreContext.Provider>;
};
