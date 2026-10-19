import { cn } from '@/shared/utils/classNames';

interface CardColorIndicatorProps {
	color?: string;
	type?: 'left' | 'right' | 'top' | 'bottom';
}

const positionClasses = {
	left: 'left-0 top-0',
	right: 'right-0 top-0',
	top: 'top-0 left-0 right-0',
	bottom: 'bottom-0 left-0 right-0',
};
/**
 * Renders a vertical color indicator bar for a card component.
 *
 * @param color - The CSS class name representing the color of the indicator.
 * @returns A div element styled as a vertical color bar on the left side of its container.
 */
export const CardColorIndicator = ({ color, type = 'left' }: CardColorIndicatorProps) => {
	return <div className={cn('absolute h-full w-1', positionClasses[type], color)} />;
};
