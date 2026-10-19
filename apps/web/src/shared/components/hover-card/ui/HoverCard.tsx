'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HoverCardContext } from '../context/HoveCardContext';
import { HoverCardContextValue, HoverCardProps } from '../types';

export const HoverCard = ({
	children,
	defaultOpen = false,
	open: controlledOpen,
	onOpenChange,
	openDelay = 500,
	closeDelay = 150,
	side = 'bottom',
	align = 'center',
}: HoverCardProps) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const openTimerRef = useRef<NodeJS.Timeout | null>(null);
	const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

	const open = controlledOpen ?? uncontrolledOpen;

	const setOpen = useCallback(
		(nextOpen: boolean) => {
			if (controlledOpen === undefined) {
				setUncontrolledOpen(nextOpen);
			}
			onOpenChange?.(nextOpen);
		},
		[controlledOpen, onOpenChange],
	);

	const clearTimers = useCallback(() => {
		if (openTimerRef.current !== null) {
			clearTimeout(openTimerRef.current);
			openTimerRef.current = null;
		}
		if (closeTimerRef.current !== null) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
	}, []);

	const scheduleOpen = useCallback(() => {
		clearTimers();
		openTimerRef.current = setTimeout(() => {
			setOpen(true);
		}, openDelay);
	}, [clearTimers, openDelay, setOpen]);

	const scheduleClose = useCallback(() => {
		clearTimers();
		closeTimerRef.current = setTimeout(() => {
			setOpen(false);
		}, closeDelay);
	}, [clearTimers, closeDelay, setOpen]);

	useEffect(() => {
		return () => clearTimers();
	}, [clearTimers]);

	const value: HoverCardContextValue = {
		open,
		setOpen,
		scheduleOpen,
		scheduleClose,
		clearTimers,
		side,
		align,
	};

	return (
		<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
			<HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>
		</PopoverPrimitive.Root>
	);
};
