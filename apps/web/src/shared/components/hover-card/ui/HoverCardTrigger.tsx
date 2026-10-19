'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { useHoverCardContext } from '../context/HoveCardContext';
import { HoverCardTriggerProps } from '../types';

export const HoverCardTrigger = ({ children, asChild = false }: HoverCardTriggerProps) => {
	const { scheduleOpen, scheduleClose } = useHoverCardContext();

	return (
		<PopoverPrimitive.Trigger asChild={asChild} onClick={(e) => e.preventDefault()}>
			<div
				onPointerEnter={scheduleOpen}
				onPointerLeave={scheduleClose}
				onFocus={scheduleOpen}
				onBlur={scheduleClose}
			>
				{children}
			</div>
		</PopoverPrimitive.Trigger>
	);
};
