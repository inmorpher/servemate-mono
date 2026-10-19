import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { MoreHorizontal, MoreVertical } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Button } from '../button/Button';

export type ActionMenuItem = {
	label: string;
	icon?: ReactNode;
	variant?: 'default' | 'destructive';
	onClick: () => void;
};

export type ActionMenuProps = {
	items: ActionMenuItem[];
	ariaLabel: string;
	orientation?: 'horizontal' | 'vertical';
};

export const ActionMenu = ({
	items,
	ariaLabel = 'Open action menu',
	orientation = 'vertical',
}: ActionMenuProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type='button'
					aria-label={ariaLabel}
					className='text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-surface1 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors'
				>
					{orientation === 'vertical' ? (
						<MoreVertical size={16} />
					) : (
						<MoreHorizontal size={16} />
					)}
				</button>
			</PopoverTrigger>

			<PopoverContent
				align='end'
				className='border-ctp-text bg-ctp-surface0 corner-squircle corner-squircle data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 w-48 space-y-1 rounded-2xl p-1'
			>
				<div className=''>
					{items.map((item) => (
						<Button
							key={item.label}
							variant={item.variant}
							onClick={() => {
								item.onClick();
								setOpen(false);
							}}
							className='w-full'
							// className={cn(
							// 	'hover:bg-ctp-surface1 text-ctp-text flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
							// 	item.variant === 'destructive' && 'text-ctp-red hover:bg-ctp-red/10'
							// )}
						>
							{item.icon}
							{item.label}
						</Button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
};
