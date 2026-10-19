'use client';

import { sidebarItems } from '@/features/sidebar/config/sidebarItems';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { useSidebarNavigation } from '@/shared/hooks/useSidebarNavigation';
import { useState } from 'react';

export const AppLauncherPopover = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { navigateToItem } = useSidebarNavigation();

	const handleAppClick = (app: (typeof sidebarItems)[number]) => {
		navigateToItem(app);
		setIsOpen(false);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					className='text-ctp-text hover:bg-ctp-surface1 flex items-center justify-center rounded-md p-2 transition-colors'
					aria-label='App Launcher'
					title='App Launcher'
					type='button'
				>
					<div className='grid grid-cols-3 gap-1'>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
					</div>
				</button>
			</PopoverTrigger>

			<PopoverContent
				className='border-ctp-surface1 bg-ctp-base w-80 rounded-lg border p-4 shadow-lg'
				side='bottom'
				align='start'
				sideOffset={8}
			>
				<div className='space-y-3'>
					<h2 className='text-ctp-text px-2 text-sm font-semibold'>Applications</h2>

					<div className='grid grid-cols-3 gap-3'>
						{sidebarItems.map((app) => {
							const Icon = app.icon;
							return (
								<button
									key={app.id}
									type='button'
									onClick={() => handleAppClick(app)}
									className={`flex aspect-square w-full flex-col items-center justify-center rounded-lg ${app.color} text-ctp-base p-2 transition-opacity hover:opacity-90`}
									title={app.label}
								>
									<div className='mb-2 flex h-8 w-8 items-center justify-center'>
										<Icon aria-hidden='true' className='h-6 w-6' />
									</div>
									<span className='line-clamp-2 text-center text-xs font-medium'>
										{app.label}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
