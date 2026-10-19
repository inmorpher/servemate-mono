import { cn } from '@/shared/utils/classNames';
import { X } from 'lucide-react';
import { Button } from '../../button';
interface TabButtonProps extends React.HTMLAttributes<HTMLDivElement> {
	label: string;
	isActive?: boolean;
	filterCount?: number;
	onClose?: () => void;
	onClick: () => void;
}
export const TabButton = ({
	label,
	isActive = false,
	filterCount,
	onClose,
	onClick,
	...props
}: TabButtonProps) => {
	const filterLabel =
		typeof filterCount === 'number'
			? `${filterCount} ${filterCount === 1 ? 'filter' : 'filters'}`
			: '';

	return (
		<div
			role='tab'
			aria-selected={isActive}
			draggable='true'
			className={cn(
				'group ring-ctp-overlay0 focus-within:ring-ctp-blue relative flex h-8 min-w-41 items-center gap-0.5 rounded-lg px-2 ring-1 transition-all duration-300 in-[dragging]:cursor-grabbing',
				isActive ? 'bg-ctp-blue ring-ctp-blue' : 'bg-ctp-surface1 hover:bg-ctp-surface2',
			)}
			{...props}
		>
			<Button
				variant='unstyled'
				onClick={onClick}
				className='h-8 min-w-0 flex-1 justify-start px-1.5 text-left font-medium capitalize focus-visible:ring-0'
			>
				<span className='min-w-0 truncate'>{label}</span>
				{filterLabel && (
					<span className='bg-ctp-surface0 text-ctp-text ml-1 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold'>
						{filterLabel}
					</span>
				)}
			</Button>
			{onClose && (
				<Button
					variant='unstyled'
					size='bare'
					onClick={(e) => {
						e.stopPropagation();
						onClose();
					}}
					className='hover:bg-ctp-surface0 ml-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md opacity-0 transition-all duration-200 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:ring-1'
					aria-label='Close tab'
				>
					<X size={14} className='text-ctp-text' />
				</Button>
			)}
		</div>
	);
};
