import { Button } from '@/shared/components/button';
import { cn } from '@/shared/utils/classNames';
import { ReactNode } from 'react';

interface ChipProps {
	children: ReactNode;
	onClick?: () => void;
	isActive?: boolean;

	className?: string;
}

export const SearchChip = ({ children, onClick, isActive = false }: ChipProps) => {
	return (
		<Button
			variant='chip'
			size={'xs'}
			onClick={onClick}
			className={cn(
				isActive &&
					'bg-ctp-blue text-ctp-base focus-visible:ring-ctp-text focus-visible:ring-2',
			)}
		>
			<span>{children}</span>
		</Button>
	);
};
