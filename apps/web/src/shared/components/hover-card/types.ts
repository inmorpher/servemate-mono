import { ReactNode } from 'react';

export type HoverCardSide = 'top' | 'right' | 'bottom' | 'left';
export type HoverCardAlign = 'start' | 'center' | 'end';

export interface HoverCardProps {
	children: ReactNode;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	openDelay?: number;
	closeDelay?: number;
	side?: HoverCardSide;
	align?: HoverCardAlign;
	sideOffset?: number;
}

export interface HoverCardTriggerProps {
	children: ReactNode;
	asChild?: boolean;
}

export interface HoverCardContentProps {
	children: ReactNode;
	className?: string;
	sideOffset?: number;
}

export interface HoverCardContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	scheduleOpen: () => void;
	scheduleClose: () => void;
	clearTimers: () => void;
	side: HoverCardSide;
	align: HoverCardAlign;
}
