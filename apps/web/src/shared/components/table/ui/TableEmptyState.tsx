import { cn } from '@/shared/utils/classNames';
import { TableEmptyStateProps } from '../types';

export const TableEmptyState = ({
	children = 'No data found',
	colSpan = 100,
	className,
	...props
}: TableEmptyStateProps) => {
	return (
		<tr className={className} {...props}>
			<td colSpan={colSpan} className={cn('text-ctp-subtext1 px-4 py-8 text-center text-sm')}>
				{children}
			</td>
		</tr>
	);
};
