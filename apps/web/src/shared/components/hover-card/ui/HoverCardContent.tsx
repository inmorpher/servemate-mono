'use client';

import { cn } from '@/shared/utils/classNames';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { forwardRef } from 'react';
import { useHoverCardContext } from '../context/HoveCardContext';
import { HoverCardContentProps } from '../types';

export const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
	({ children, className, sideOffset = 8 }, ref) => {
		const { scheduleOpen, scheduleClose, side, align } = useHoverCardContext();

		return (
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					ref={ref}
					side={side}
					align={align}
					sideOffset={sideOffset}
					className={cn(
						'border-ctp-surface1 bg-ctp-surface0 text-ctp-text border',
						'corner-squircle rounded-2xl p-3 shadow-xl',
						'data-[state=open]:animate-in data-[state=closed]:animate-out',
						'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
						'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
						'data-[side=bottom]:slide-in-from-top-2',
						'data-[side=top]:slide-in-from-bottom-2',
						'data-[side=left]:slide-in-from-right-2',
						'data-[side=right]:slide-in-from-left-2',
						'z-50',
						className,
					)}
					onPointerEnter={scheduleOpen}
					onPointerLeave={scheduleClose}
				>
					{children}
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		);
	},
);

HoverCardContent.displayName = 'HoverCardContent';
