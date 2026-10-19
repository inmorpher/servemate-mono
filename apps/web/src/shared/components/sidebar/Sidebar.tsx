'use client';

import { cn } from '@/shared/utils/classNames';
import { FC } from 'react';
import { ISidebarProps } from './types';

const Sidebar: FC<ISidebarProps> = ({ children }) => {
	return (
		<aside
			aria-label='Side navigation'
			className={cn(
				'bg-ctp-base sticky top-14 z-10 hidden h-[calc(100vh-3.5625rem)] w-16 shrink-0 flex-col self-start p-2 lg:flex',
			)}
		>
			<nav className='flex flex-1 flex-col items-center gap-4 overflow-x-hidden overflow-y-auto'>
				{children}
			</nav>
		</aside>
	);
};

export default Sidebar;
