import { cn } from '@/shared/utils/classNames';
import { TableHeadProps } from '../types';

export const TableHead = ({ className, ref, children, ...props }: TableHeadProps) => {
	return (
		<thead
			ref={ref}
			className={cn(
				'bg-ctp-surface0/95 border-ctp-surface1 sticky top-0 z-10 border-b backdrop-blur-sm',
				className,
			)}
			{...props}
		>
			{children}
		</thead>
	);
};
