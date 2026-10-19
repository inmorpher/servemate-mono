import { ReactNode } from 'react';

interface CardContainerProps {
	children?: ReactNode;
}

/**
 * A container component that wraps its children with styled div.
 *
 * @param {CardContainerProps} props - The props for the CardContainer component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the container.
 *
 * @remarks
 * Applies background color, padding, rounded corners, and hover effects.
 * Intended for use as a card-like UI element.
 */
export const CardContainer = ({ children }: CardContainerProps) => {
	return (
		<div className='relative bg-ctp-base hover:bg-ctp-surface0 px-6 py-2 rounded-lg overflow-y-hidden transition-colors hover:cursor-pointer corner-squircle'>
			{children}
		</div>
	);
};
