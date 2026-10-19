'use client';

import { cn } from '@/shared/utils/classNames';
import { X } from 'lucide-react';
import { ReactNode, startTransition } from 'react';

type NavButtonVariant = 'sidebar' | 'tab';

type NavButtonProps = {
	label: string;
	onClick: () => void;
	icon?: ReactNode;
	isActive?: boolean;
	onClose?: () => void;
	variant?: NavButtonVariant;
	classNames?: string;
};

export const NavButton = ({
	label,
	onClick,
	icon,
	isActive = false,
	onClose,
	variant = 'tab',
	classNames,
}: NavButtonProps) => {
	const clickHandler = () => {
		startTransition(() => {
			onClick();
		});
	};

	return (
		<div
			role='tab'
			aria-selected={isActive}
			className={cn(
				'group corner-squircle gap-1/2 bg-ctp-surface2 flex min-w-41 items-center rounded-lg px-2 py-1 text-sm transition-all duration-300',
				isActive
					? 'bg-ctp-surface0 text-ctp-text border-ctp-blue ring-ctp-blue ring-1'
					: 'bg-ctp-base text-ctp-subtext0 hover:bg-ctp-surface1 border-transparent',
				classNames,
			)}
		>
			<button
				className='hover:text-ctp-text flex-1 truncate text-left font-medium capitalize transition-colors focus:outline-none'
				onClick={clickHandler}
			>
				{label}
			</button>

			{onClose && (
				<button
					onClick={(event) => {
						event.stopPropagation();
						onClose();
					}}
					className={cn(
						'rounded p-1 opacity-0 transition-all duration-200 group-hover:opacity-100 focus:outline-none',
						isActive
							? 'hover:bg-ctp-surface1 text-ctp-text'
							: 'hover:bg-ctp-surface2 text-ctp-subtext',
					)}
					title='Close Tab'
					aria-label={`Close ${label} tab`}
				>
					<X size={16} />
				</button>
			)}
		</div>
	);
};
