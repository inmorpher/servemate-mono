import { ReactNode, ViewTransition } from 'react';
import { ListSkeleton } from '../components/skeleton/ListSkeleton';
import { cn } from '../utils/classNames';
interface ListProps<T extends { id: number }> {
	items: T[] | undefined;
	ItemComponent: (item: T) => ReactNode;
	isLoading?: boolean;
	isFetching?: boolean;
	emptyMessage?: string;
	skeletonCount?: number;
	className?: string;
	gridClassName?: string;
}

/**
 * Generic List component that renders a collection of items in list or grid layout.
 */
export const List = <T extends { id: number }>({
	items,
	ItemComponent,
	isLoading,
	isFetching,
	emptyMessage = 'No items found',
	skeletonCount = 5,
	className,
	gridClassName,
}: ListProps<T>) => {
	if (isLoading && !items) {
		return <ListSkeleton count={skeletonCount} />;
	}

	if (!isLoading && (!items || items.length === 0)) {
		return <div className='text-center text-gray-500'>{emptyMessage}</div>;
	}

	const containerClass = gridClassName ? gridClassName : cn('space-y-4 min-h-full', className);

	return (
		<div className={containerClass} style={{ minHeight: 'inherit' }}>
			<ViewTransition>
				{items?.map((item) => (
					<div key={item.id} className={cn(isFetching && 'animate-pulse')}>
						{ItemComponent(item)}
					</div>
				))}
			</ViewTransition>
		</div>
	);
};
