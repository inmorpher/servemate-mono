'use client';

import { sidebarItems } from '@/features/sidebar/config/sidebarItems';
import { SidebarNavItem } from '@/shared/components/sidebar/SidebarNavItem';

export const SidebarNavigation = () => {
	return (
		<div className='flex flex-col items-center gap-3'>
			{sidebarItems.map((item) => (
				<SidebarNavItem key={item.id} item={item} />
			))}
		</div>
	);
};
