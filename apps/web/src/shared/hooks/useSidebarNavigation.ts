'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { TabEntities } from '@/shared/components/tabs/types/tabs.type';
import { useRouter } from 'next/navigation';

interface UseSidebarNavigationParams {
	entity: TabEntities;
	label: string;
	href: string;
	openInTab: boolean;
}

export const useSidebarNavigation = () => {
	const router = useRouter();
	const tabs = useTabs((state) => state.tabs);
	const addTab = useTabs((state) => state.addTab);
	const setActiveTab = useTabs((state) => state.setActiveTab);

	const navigateToItem = ({ entity, label, href, openInTab }: UseSidebarNavigationParams) => {
		if (openInTab) {
			const existingTab = tabs.find(
				(tab) => tab.entity === entity && Object.keys(tab.filters ?? {}).length === 0,
			);

			if (existingTab) {
				setActiveTab(existingTab.id);
			} else {
				addTab({ title: label, entity });
			}
		}

		router.push(href);
	};

	return { navigateToItem };
};
