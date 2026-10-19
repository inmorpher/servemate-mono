import { cn } from '@/shared/utils/classNames';
import { ElementType, ReactNode } from 'react';

interface CardTitleProps {
	children?: ReactNode;
	className?: string;
	type?: 'text' | 'heading' | 'plain';
}

const typeToTag: Record<NonNullable<CardTitleProps['type']>, ElementType> = {
	text: 'p',
	heading: 'h4',
	plain: 'span',
};

const typeToClass: Record<NonNullable<CardTitleProps['type']>, string> = {
	text: 'text-ctp-text text-base',
	heading: 'font-semibold text-ctp-text text-lg',
	plain: 'text-ctp-subtext0',
};

/**
 * Renders a text element for a card title with customizable HTML tag and styling based on the `type` prop.
 *
 * @param {CardTitleProps} props - The properties for the CardText component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the card text.
 * @param {string} [props.className] - Additional CSS classes to apply to the element.
 * @param {'plain' | string} [props.type='plain'] - The type of card text, which determines the HTML tag and styling.
 * @returns {JSX.Element} The rendered card text element.
 */
export const CardText = ({ children, className, type = 'plain' }: CardTitleProps) => {
	const Tag = typeToTag[type];
	const typeClass = typeToClass[type];

	return <Tag className={cn(typeClass, className)}>{children}</Tag>;
};
