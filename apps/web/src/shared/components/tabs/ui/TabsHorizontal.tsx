'use client';

import { formatFilterKey, formatFilterValue } from '@/shared/utils/formatTabFilters';
import { startTransition } from 'react';
import { HoverCardComponent } from '../../hover-card';
import { useTabs } from '../store/useTabs';
import { TabButton } from './TabButton';
import { components } from '@/shared/api/api-types';

type TabsHorizontalProps = {
	isMobile?: boolean;
};


type CreateUserBody = components['schemas']['CreateUserSchema'];
type UserResponse = components['schemas']['UserResponseSchema'];
export const TabsHorizontal = ({ isMobile = false }: TabsHorizontalProps) => {
	const { tabs, activeTabId, setActiveTab, removeTab } = useTabs();

	if (tabs.length === 0) {
		return null;
	}

	const handleTabSelect = (tabId: string) => {
		startTransition(() => {
			setActiveTab(tabId);
		});
	};

	return (
		<div
			role='tablist'
			className={`ml-1.5 gap-4 self-end overflow-x-auto p-1 lg:flex ${isMobile ? 'lg:flex' : 'hidden'}`}
		>
			{tabs.map((tab) => {
				const filterEntries = Object.entries(tab.filters ?? {});
				const filterCount = filterEntries.length;
				const hasFilters = filterCount > 0;

				const tabButton = (
					<TabButton
						key={'tab-' + tab.id}
						label={tab?.title}
						filterCount={hasFilters ? filterCount : undefined}
						isActive={tab.id === activeTabId}
						onClick={() => handleTabSelect(tab.id)}
						onClose={() => removeTab(tab.id)}
					/>
				);

				// If no filters, render the <TabButton> directly
				if (!hasFilters) {
					return tabButton;
				}

				// If there are filters, wrap in HoverCard
				return (
					<HoverCardComponent key={'tab-hover-' + tab.id}>
						<HoverCardComponent.Trigger asChild>{tabButton}</HoverCardComponent.Trigger>
						<HoverCardComponent.Content>
							<div className='space-y-2'>
								{filterEntries.map(([key, value]) => (
									<div key={key} className='text-sm'>
										<span className='text-ctp-subtext1 font-medium'>
											{formatFilterKey(key)}:
										</span>
										<span className='text-ctp-text ml-2'>
											{formatFilterValue(key, value)}
										</span>
									</div>
								))}
							</div>
						</HoverCardComponent.Content>
					</HoverCardComponent>
				);
			})}
		</div>
	);
};
