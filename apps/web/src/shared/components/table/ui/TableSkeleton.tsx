import { cn } from '@/shared/utils/classNames';
import { TableSkeletonProps } from '../types';

export const TableSkeleton = ({ rows = 6, columns = 5, className }: TableSkeletonProps) => {
	return (
		<tbody className={cn('divide-ctp-surface1 animate-pulse divide-y', className)}>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<tr key={'table_skeleton_row' + rowIndex} className='border-ctp-surface1 border-b'>
					{Array.from({ length: columns }).map((_, columnIndex) => (
						<td
							key={'table_skeleton_cell' + columnIndex}
							className={cn(
								'px-4 py-4',
								columnIndex === 0 && 'w-36',
								columnIndex === columns - 1 && 'ml-auto w-24',
							)}
						>
							<div className='bg-ctp-surface1 h-4 rounded' />
						</td>
					))}
				</tr>
			))}
		</tbody>
	);
};
