import { cn } from '@/shared/utils/classNames';
import { ReactNode } from 'react';

interface FilterContainerProps {
	children: ReactNode;
	title?: string;
	className?: string;
}

/**
 * A container component for filter elements, typically used in sidebars or filter panels.
 *
 * @param {object} props - The props for the FilterContainer component.
 * @param {React.ReactNode} props.children - The filter elements or content to be displayed inside the container.
 * @param {string} [props.title] - Optional title to display at the top of the container.
 * @param {string} [props.className] - Additional CSS classes to apply to the container.
 *
 * @returns {JSX.Element} The rendered filter container component.
 */
export const FilterContainer = ({ children, title, className }: FilterContainerProps) => {
	return (
		<div className={cn('flex flex-col items-center space-y-4', className)}>
			{title && <h3 className='text-lg font-semibold'>{title}</h3>}
			{children}
		</div>
	);
};
