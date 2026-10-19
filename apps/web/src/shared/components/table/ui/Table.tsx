import { cn } from '@/shared/utils/classNames';
import { TableProps } from '../types';

export const TableRoot = ({
	children,
	className,
	isVertiacal = false,
	ref,
	...props
}: TableProps) => {
	return (
		<table
			ref={ref}
			className={cn(
				'text-ctp-text text-m corner-squircle w-full caption-bottom border-collapse overflow-x-auto rounded-xl',

				className,
			)}
			{...props}
		>
			{children}
		</table>
	);
};
