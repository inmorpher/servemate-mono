import { nanoid } from 'nanoid';
import { devtools } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import {
	isTabEntity,
	type Tab,
	type TabsState,
	type TabsStore,
	type WorkspaceTabsInput,
} from '../types/tabs.type';

const MAX_TABS = 10;

export const emptyTabsState: TabsState = { tabs: [], activeTabId: '' };

export const workspaceToTabsState = (workspace: WorkspaceTabsInput): TabsState => {
	const tabs = workspace.tabs
		.slice()
		.sort((firstTab, secondTab) => firstTab.order - secondTab.order)
		.flatMap((workspaceTab): Tab[] => {
			if (!isTabEntity(workspaceTab.type)) {
				return [];
			}

			return [
				{
					id: workspaceTab.id,
					title: workspaceTab.title,
					entity: workspaceTab.type,
					filters: workspaceTab.state,
					pinned: workspaceTab.pinned,
				},
			];
		});
	const activeTabId = tabs.some((tab) => tab.id === workspace.activeTabId)
		? (workspace.activeTabId as string)
		: (tabs[0]?.id ?? '');

	return { tabs, activeTabId };
};

export const createTabsStore = (initState: TabsState = emptyTabsState) =>
	createStore<TabsStore>()(
		devtools((set, get) => ({
			...initState,
			addTab: ({ pinned, title, filters, entity, timestamp = Date.now() }) => {
				const { tabs } = get();

				if (tabs.length >= MAX_TABS) {
					alert(`You can only have a maximum of ${MAX_TABS} tabs open at once.`);
					return;
				}

				const id = nanoid(8);

				set({
					tabs: [
						...tabs,
						{ id, pinned: pinned ?? false, title, filters, entity, timestamp },
					],
					activeTabId: id,
				});
			},
			removeTab: (tabId) => {
				const { tabs, activeTabId } = get();
				const tabIndex = tabs.findIndex((t) => t.id === tabId);
				const newTabs = tabs.filter((t) => t.id !== tabId);

				let newActiveTabId = activeTabId;

				if (tabId === activeTabId) {
					// Prefer the next neighbour, fall back to the previous one
					newActiveTabId = newTabs[Math.min(tabIndex, newTabs.length - 1)]?.id ?? '';
				}

				set({ tabs: newTabs, activeTabId: newActiveTabId });
			},
			setActiveTab: (tabId) => {
				if (get().tabs.some((t) => t.id === tabId)) {
					set({ activeTabId: tabId });
				}
			},
			getTabById: (tabId) => get().tabs.find((t) => t.id === tabId),
			pinTab: (tabId) => {
				set({ tabs: get().tabs.map((t) => (t.id === tabId ? { ...t, pinned: true } : t)) });
			},
			unpinTab: (tabId) => {
				set({
					tabs: get().tabs.map((t) => (t.id === tabId ? { ...t, pinned: false } : t)),
				});
			},
			updateTab: (tabId, fields) => {
				// Undefined values must not overwrite existing fields
				const cleanFields = Object.fromEntries(
					Object.entries(fields).filter(([, value]) => value !== undefined),
				) as Partial<Omit<Tab, 'id'>>;

				if (cleanFields.filters) {
					const cleanedFilters = Object.fromEntries(
						Object.entries(cleanFields.filters).filter(
							([, value]) =>
								value !== undefined &&
								value !== null &&
								value !== '' &&
								(Array.isArray(value) ? value.length > 0 : true),
						),
					);

					cleanFields.filters =
						Object.keys(cleanedFilters).length > 0 ? cleanedFilters : undefined;
				}

				set({
					tabs: get().tabs.map((t) => (t.id === tabId ? { ...t, ...cleanFields } : t)),
				});
			},
			clearTabs: () => {
				set({ tabs: [], activeTabId: '' });
			},
			clearFilters: (tabId) => {
				set({
					tabs: get().tabs.map((t) =>
						t.id === tabId ? { ...t, filters: undefined } : t,
					),
				});
			},
		})),
	);

export type TabsStoreApi = ReturnType<typeof createTabsStore>;
