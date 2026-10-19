'use client';

import { useTabs, useTabsStoreApi } from '@/shared/components/tabs/store/useTabs';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import type { PaymentSearchCriteria } from '../types';

export const usePaymentFilters = (tabId: Tab['id']) => {
	const tabsStore = useTabsStoreApi();
	const currentTab = useTabs((state) => state.getTabById(tabId)) as
		| Tab<PaymentSearchCriteria>
		| undefined;
	const filters = currentTab?.filters;

	const updateFilters = (patch: Partial<PaymentSearchCriteria>) => {
		const store = tabsStore.getState();
		const tab = store.getTabById(tabId) as Tab<PaymentSearchCriteria> | undefined;
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

	const handleOrderChange = (value: string) => {
		updateFilters({ orderId: value ? Number(value) : undefined });
	};

	const handleClearFilters = () => {
		tabsStore.getState().clearFilters(tabId);
	};

	const hasFilters = Boolean(filters?.status || filters?.orderId !== undefined);

	return {
		filters,
		handleStatusChange,
		handleOrderChange,
		handleClearFilters,
		hasFilters,
	};
};
