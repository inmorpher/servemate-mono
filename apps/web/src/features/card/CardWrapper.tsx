import { cn } from '@/shared/utils/classNames';
import { ReactNode } from 'react';

interface CardWrapperProps {
	children: ReactNode;
	className?: string;
}

/**
 * A wrapper component that renders its children inside a div with a flexible grow style.
 *
 * @param {CardWrapperProps} props - The props for the CardWrapper component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the wrapper.
 * @param {string} [props.className] - Additional CSS class names to apply to the wrapper div.
 * @returns {JSX.Element} The rendered wrapper component.
 */
export const CardWrapper = ({ children, className }: CardWrapperProps) => {
	return <div className={cn('flex-grow', className)}>{children}</div>;
};
