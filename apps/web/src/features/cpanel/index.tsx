'use client';

import { TabEntities } from '@/shared/components/tabs/types/tabs.type';
import React, { JSX, Suspense } from 'react';
import { useTabs } from '../../shared/components/tabs/store/useTabs';

type TabComponentProps = {
	tabId: string;
};

const tabComponentMap: Partial<
	Record<TabEntities, React.LazyExoticComponent<(props: TabComponentProps) => JSX.Element>>
> = {
	users: React.lazy(() => import('../users/ui/UserClientPage')),
	orders: React.lazy(() => import('../orders/ui/OrdersListPage')),
	reservations: React.lazy(() => import('../reservations/ui/ReservationsListPage')),
	drinks: React.lazy(() => import('../drinks/ui/DrinksListPage')),
	food: React.lazy(() => import('../food/ui/FoodListPage')),
	tables: React.lazy(() => import('../tables/ui/TablesListPage')),
	payments: React.lazy(() => import('../payments/ui/PaymentsListPage')),
};

const CPanelIndex = () => {
	// const { tabs, activeTabId } = useTabs();
	const tabs = useTabs((state) => state.tabs);
	const activeTabId = useTabs((state) => state.activeTabId);

	const activeTab = tabs.find((tab) => tab.id === activeTabId);
	const ActiveComponent = activeTab ? tabComponentMap[activeTab.entity] : null;

	if (!activeTab || !ActiveComponent) {
		return (
			<div className='flex h-full flex-col items-center justify-center p-4 text-center'>
				<h1 className='text-ctp-mauve mb-4 text-2xl font-bold'>Control Panel</h1>
				<p className='text-ctp-subtext0 text-lg'>Select an app from the sidebar.</p>
			</div>
		);
	}

	return (
		<Suspense fallback={<div className='p-4'>Loading...</div>}>
			<ActiveComponent tabId={activeTab.id} />
		</Suspense>
	);
};

export default CPanelIndex;
