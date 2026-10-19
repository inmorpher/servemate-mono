'use client';

import { useTabs, useTabsStoreApi } from '@/shared/components/tabs/store/useTabs';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import type { TableSearchCriteria } from '../types';

export const useTableFilters = (tabId: Tab['id']) => {
	const tabsStore = useTabsStoreApi();
	const currentTab = useTabs((state) => state.getTabById(tabId)) as
		| Tab<TableSearchCriteria>
		| undefined;
	const filters = currentTab?.filters;

	const updateFilters = (patch: Partial<TableSearchCriteria>) => {
		const store = tabsStore.getState();
		const tab = store.getTabById(tabId) as Tab<TableSearchCriteria> | undefined;
		if (!tab) {
			return;
		}

		store.updateTab(tabId, {
			filters: {
				...(tab.filters ?? {}),
				...patch,
				page: 1,
			},
		});
	};

	const handleStatusChange = (value: string) => {
		updateFilters({ status: value || undefined });
	};

	const handleOccupiedChange = (value: string) => {
		updateFilters({ isOccupied: value === '' ? undefined : value === 'true' });
	};

	const handleNumberChange = (
		key: 'tableNumber' | 'minCapacity' | 'maxCapacity',
		value: string,
	) => {
		updateFilters({ [key]: value === '' ? undefined : Number(value) });
	};

	const handleClearFilters = () => {
		tabsStore.getState().clearFilters(tabId);
	};

	const hasFilters = Boolean(
		filters?.status ||
		filters?.tableNumber !== undefined ||
		filters?.minCapacity !== undefined ||
		filters?.maxCapacity !== undefined ||
		filters?.isOccupied !== undefined,
	);
	const canQuery = Boolean(filters?.status?.trim()) && filters?.isOccupied !== undefined;

	return {
		filters,
		handleStatusChange,
		handleOccupiedChange,
		handleNumberChange,
		handleClearFilters,
		hasFilters,
		canQuery,
	};
};
