'use client';
import type { SidebarNavigationItem } from '@/features/sidebar/config/sidebarItems';
import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { useSidebarNavigation } from '@/shared/hooks/useSidebarNavigation';
import { usePathname } from 'next/navigation';

interface SidebarNavItemProps {
	item: SidebarNavigationItem;
}

export const SidebarNavItem = ({ item }: SidebarNavItemProps) => {
	const pathname = usePathname();
	const activeTabId = useTabs((state) => state.activeTabId);
	const activeTab = useTabs((state) => state.tabs.find((tab) => tab.id === activeTabId));
	const { navigateToItem } = useSidebarNavigation();
	const Icon = item.icon;
	const isActive =
		pathname === item.href && (!item.openInTab || activeTab?.entity === item.entity);

	return (
		<button
			type='button'
			onClick={() => navigateToItem(item)}
			aria-label={item.label}
			aria-current={isActive ? 'page' : undefined}
			title={item.label}
			className={`focus-visible:ring-ctp-blue relative flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none ${
				isActive
					? 'bg-ctp-surface0 text-ctp-blue before:bg-ctp-blue before:absolute before:-left-2 before:h-6 before:w-0.5 before:rounded-r'
					: 'text-ctp-subtext0 hover:bg-ctp-surface0 hover:text-ctp-text'
			}`}
		>
			<Icon aria-hidden='true' className='h-5 w-5' />
		</button>
	);
};
