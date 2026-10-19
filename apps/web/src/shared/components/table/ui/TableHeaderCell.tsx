import { cn } from '@/shared/utils/classNames';
import { ArrowDown, ArrowDownUp, ArrowUp } from 'lucide-react';
import { TableHeaderCellProps } from '../types';

export const TableHeaderCell = ({
	className,
	alignRight = false,
	isSorted,
	isSortable = false,
	children,
	ref,
	...props
}: TableHeaderCellProps) => {
	return (
		<th
			ref={ref}
			scope='col'
			className={cn(
				'border-ctp-surface1 bg-ctp-surface0 text-m px-4 py-3 text-left font-semibold tracking-wide uppercase',
				alignRight && 'text-right',
				isSortable && 'select-none',
				className,
			)}
			{...props}
		>
			<div className={cn('flex items-center gap-2', alignRight && 'justify-end')}>
				{children}
				{isSortable && (
					<span className='text-ctp-subtext1 text-[10px] font-medium'>
						{isSorted === 'asc' ? (
							<ArrowUp size={16} />
						) : isSorted === 'desc' ? (
							<ArrowDown size={16} />
						) : (
							<ArrowDownUp size={16} />
						)}
					</span>
				)}
			</div>
		</th>
	);
};
