'use client';

import { cn } from '@/lib/utils';
import { Dialog } from 'radix-ui';
import { FC, useRef } from 'react';
import { DrawerProps } from './types';

/**
 * Drawer component that displays a sliding panel from a specified direction.
 *
 * @param {DrawerProps} props - The props for the Drawer component.
 * @param {boolean} props.isOpen - Controls whether the drawer is open.
 * @param {(open: boolean) => void} props.onOpenChange - Callback invoked when the open state changes.
 * @param {'left' | 'right' | 'top' | 'bottom'} [props.direction='left'] - The direction from which the drawer appears.
 * @param {React.ReactNode} props.children - The content to display inside the drawer.
 *
 * @returns {JSX.Element | null} The rendered Drawer component, or null if not open.
 */
export const Drawer: FC<DrawerProps> = ({
	isOpen,
	onOpenChange,
	id = 'drawer',
	children,
	className,
	direction = 'left',
}) => {
	const drawerRef = useRef<HTMLDivElement>(null);

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Trigger asChild>
				<button
					className='border-ctp-surface1 bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1 active:bg-ctp-surface2 flex items-center gap-2 border-b px-4 py-3 text-sm font-medium transition-colors'
					aria-label='Toggle filters panel'
					aria-controls='filters-drawer'
				>
					<svg
						width='18'
						height='18'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='shrink'
					>
						<polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' />
					</svg>
					<span>Show Filters</span>
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay
					forceMount
					id={`${id}-overlay`}
					className={cn(
						'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm',
						'data-[state=open]:animate-in data-[state=closed]:animate-out',
						'data-[state=open]:fade-in data-[state=closed]:fade-out',
						'duration-300',
					)}
				/>
				<Dialog.Content
					forceMount
					ref={drawerRef}
					id={`${id}-content`}
					className={cn(
						'bg-ctp-base scrollbat-thin fixed top-0 z-50 h-full w-[85vw] max-w-90 shadow-xl',
						'data-[state=open]:animate-in data-[state=closed]:animate-out',
						'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
						'duration-300',
						direction === 'right'
							? 'right-0 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0'
							: 'left-0 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
						className,
					)}
				>
					<Dialog.Title className='sr-only'>Filters</Dialog.Title>
					<Dialog.Description className='sr-only'>Filter controls</Dialog.Description>
					<div className='h-full overflow-y-auto'>{children}</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
