import { cn } from '@/shared/utils/classNames';
import { TableCellProps } from '../types';

export const TableCell = ({
	className,
	isSelected,
	ref,
	truncate = true,
	align = 'left',
	...props
}: TableCellProps) => {
	return (
		<td
			ref={ref}
			align={align}
			className={cn(
				'border-ctp-surface1 data-[active=true]:bg-ctp-surface1/60 bg-ctp-surface0 group-hover:bg-ctp-surface0/2 px-4 py-3 text-left align-middle font-semibold',
				truncate && 'truncate whitespace-nowrap',
				isSelected && 'bg-ctp-red',
				className,
			)}
			{...props}
		/>
	);
};
