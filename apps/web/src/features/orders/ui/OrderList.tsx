'use client';

import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { Table } from '@/shared/components/table';
import { OrderSearchCriteria, OrderSearchListResult, OrderSortOptions } from '@servemate/dto';
import { Pencil, Phone, Printer, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { useCallOrderItems } from '../hooks/useCallOrderItems';
import { useDeleteOrder } from '../hooks/useDeleteOrder';
import { usePrintOrderItems } from '../hooks/usePrintOrderItems';
import { formatCurrency, formatDate, getStatusColor } from '../utils/orderHelpers';
export type OrderListItem = OrderSearchListResult['orders'][number];

export interface OrderListProps {
	orders: OrderListItem[] | undefined;
	isLoading?: boolean;
	sortBy?: OrderSearchCriteria['sortBy'];
	sortOrder?: OrderSearchCriteria['sortOrder'];
	onSortChange: (sortBy: NonNullable<OrderSearchCriteria['sortBy']>) => void;
	onEditOrder?: (order: OrderListItem) => void;
}

const columns = [
	{ label: 'Order', sortBy: OrderSortOptions.ID },
	{ label: 'Status', sortBy: OrderSortOptions.STATUS },
	{ label: 'Table', sortBy: OrderSortOptions.TABLE_NUMBER },
	{ label: 'Guests', sortBy: OrderSortOptions.GUESTS_NUMBER },
	{ label: 'Total', sortBy: OrderSortOptions.TOTAL_AMOUNT },
	{ label: 'Time', sortBy: OrderSortOptions.ORDER_TIME },
] as const satisfies ReadonlyArray<{
	label: string;
	sortBy: NonNullable<OrderSearchCriteria['sortBy']>;
}>;

export const OrderList = ({
	orders,
	isLoading,
	onSortChange,
	sortBy,
	sortOrder,
	onEditOrder,
}: OrderListProps) => {
	const deleteOrderMutation = useDeleteOrder();
	const printOrderItemsMutation = usePrintOrderItems();
	const callOrderItemsMutation = useCallOrderItems();

	const isActiveColumn = useCallback(
		(columnSortBy: NonNullable<OrderSearchCriteria['sortBy']>) => sortBy === columnSortBy,
		[sortBy],
	);

	const handleDeleteOrder = async (orderId: number) => {
		const shouldDelete = globalThis.confirm(`Delete order #${orderId}?`);
		if (!shouldDelete) {
			return;
		}

		await deleteOrderMutation.mutateAsync({ id: String(orderId) });
	};

	const handlePrintOrderItems = async (orderId: number) => {
		await printOrderItemsMutation.mutateAsync({ id: String(orderId) });
	};

	const handleCallOrderItems = async (orderId: number) => {
		await callOrderItemsMutation.mutateAsync({ id: String(orderId) });
	};

	return (
		<div className='border-ctp-surface1 bg-ctp-surface0 max-w-full overflow-x-auto rounded-xl border'>
			<Table className='text-ctp-text w-full table-fixed'>
				<colgroup>
					<col style={{ width: '5rem' }} />
					<col style={{ width: '10rem' }} />
					<col style={{ width: '8rem' }} />
					<col style={{ width: '8rem' }} />
					<col style={{ width: '8rem' }} />
					<col style={{ width: '8rem' }} />
					<col style={{ width: '5rem' }} />
				</colgroup>
				<Table.Head>
					<Table.Row className='bg-ctp-surface1/60 text-ctp-subtext0 divide-amber-50 p-0'>
						{columns.map((column) => {
							const isActiveSort = isActiveColumn(column.sortBy);
							return (
								<Table.HeaderCell
									key={column.label}
									isSortable
									isSorted={isActiveSort ? (sortOrder ?? undefined) : undefined}
									data-active={isActiveSort}
									onClick={() => onSortChange(column.sortBy)}
									className='group/column cursor-pointer'
								>
									{column.label}
								</Table.HeaderCell>
							);
						})}
						<Table.HeaderCell className='w-15' key={'column-actions'}>
							<span className='sr-only'>actions</span>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Head>

				{isLoading ? (
					<Table.Skeleton rows={10} columns={columns.length} />
				) : (
					<Table.Body>
						{orders?.map((order) => (
							<Table.Row key={order.id}>
								<Table.Cell data-active={isActiveColumn(OrderSortOptions.ID)}>
									#{order.id}
								</Table.Cell>

								<Table.Cell
									className={getStatusColor(order.status)}
									data-active={isActiveColumn(OrderSortOptions.STATUS)}
								>
									{order.status}
								</Table.Cell>
								<Table.Cell
									data-active={isActiveColumn(OrderSortOptions.TABLE_NUMBER)}
								>
									{order.tableNumber}
								</Table.Cell>
								<Table.Cell
									data-active={isActiveColumn(OrderSortOptions.GUESTS_NUMBER)}
								>
									{order.guestsCount}
								</Table.Cell>
								<Table.Cell
									className='text-ctp-green font-semibold'
									data-active={isActiveColumn(OrderSortOptions.TOTAL_AMOUNT)}
								>
									{formatCurrency(order.totalAmount)} |{' '}
									{formatCurrency(order.tip)} | {formatCurrency(order.discount)}
								</Table.Cell>
								<Table.Cell
									className='text-monospace text-ctp-subtext0'
									align='justify'
									data-active={isActiveColumn(OrderSortOptions.ORDER_TIME)}
								>
									{formatDate(order.orderTime)}
								</Table.Cell>
								<Table.Cell truncate={false}>
									<ActionMenu
										orientation='horizontal'
										items={[
											{
												label: 'Edit order',
												icon: <Pencil size={16} />,
												onClick: () => {
													onEditOrder?.(order);
												},
												variant: 'default',
											},
											{
												label: 'Print items',
												icon: <Printer className='h-4 w-4' />,
												onClick: () => {
													void handlePrintOrderItems(order.id);
												},
											},
											{
												label: 'Call items',
												icon: <Phone className='h-4 w-4' />,
												onClick: () => {
													void handleCallOrderItems(order.id);
												},
											},
											{
												label: 'Delete order',
												icon: <Trash2 className='h-4 w-4' />,
												onClick: () => {
													void handleDeleteOrder(order.id);
												},
												variant: 'destructive',
											},
										]}
										ariaLabel={`Actions for order #${order.id}`}
									/>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				)}
			</Table>
		</div>
	);
};
