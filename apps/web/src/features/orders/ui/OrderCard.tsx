import { Card } from '@/features/card';
import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { OrderSearchListResult } from '@servemate/dto';
import { memo, ViewTransition } from 'react';
import {
	formatCurrency,
	formatDate,
	getStatusColor,
	getStatusIndicatorColor,
} from '../utils/orderHelpers';

type OrderListItem = OrderSearchListResult['orders'][number];

/**
 * Compact order card for list/grid view with essential information only.
 * Shows: Order ID, Status, Total Amount, Order Time, and Color Indicator
 */
const OrderCard = memo(function OrderCard({ order }: { order: OrderListItem }) {
	const statusColor = getStatusColor(order.status);
	const statusIndicatorColor = getStatusIndicatorColor(order.status);
	const formattedOrderTime = formatDate(order.orderTime);

	return (
		<ViewTransition>
			<Card>
				<Card.ColorIndicator color={statusIndicatorColor} />
				<Card.Wrapper className='flex h-full flex-col justify-between gap-4'>
					{/* Header: Order ID + Status Badge */}
					<div className='flex items-start justify-between gap-2'>
						<Card.Text type='heading' className='text-lg'>
							Order #{order.id}
						</Card.Text>
						<Card.Text
							className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${statusColor}`}
						>
							{orderSearchOptions.statuses.find(
								(option) => option.value === order.status,
							)?.label || order.status}
						</Card.Text>
					</div>

					{/* Body: Table, Guests */}
					<div className='text-ctp-subtext1 flex items-center gap-4 text-sm'>
						<div className='flex items-center gap-1'>
							<span className='font-medium'>Table</span>
							<span className='text-ctp-text font-bold'>{order.tableNumber}</span>
						</div>
						<div className='flex items-center gap-1'>
							<span className='font-medium'>Guests:</span>
							<span className='text-ctp-text font-bold'>{order.guestsCount}</span>
						</div>
					</div>

					{/* Footer: Total + Time */}
					<div className='border-ctp-surface1 flex items-center justify-between gap-2 border-t pt-2'>
						<Card.Text className='text-ctp-green text-base font-bold'>
							{formatCurrency(order.totalAmount)}
						</Card.Text>
						<Card.Text className='text-ctp-subtext1 text-xs'>
							{formattedOrderTime}
						</Card.Text>
					</div>
				</Card.Wrapper>
			</Card>
		</ViewTransition>
	);
});

export { OrderCard };
