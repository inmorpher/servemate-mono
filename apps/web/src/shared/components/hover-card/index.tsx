import { HoverCard } from './ui/HoverCard';
import { HoverCardContent } from './ui/HoverCardContent';
import { HoverCardTrigger } from './ui/HoverCardTrigger';

export const HoverCardComponent = Object.assign(HoverCard, {
	Trigger: HoverCardTrigger,
	Content: HoverCardContent,
});

export * from './context/HoveCardContext';
export * from './types';
