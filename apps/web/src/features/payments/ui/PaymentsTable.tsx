'use client';

import { Table } from '@/shared/components/table';
import type { PaymentListItem, PaymentSearchCriteria } from '../types';

type SortField = NonNullable<PaymentSearchCriteria['sortBy']>;

interface PaymentsTableProps {
	payments: PaymentListItem[] | undefined;
	isLoading?: boolean;
	sortBy?: PaymentSearchCriteria['sortBy'];
	sortOrder?: PaymentSearchCriteria['sortOrder'];
	onSortChange: (sortBy: SortField) => void;
}

const columns = [
	{ label: 'ID', sortBy: 'id' },
	{ label: 'Order', sortBy: 'orderId' },
	{ label: 'Status', sortBy: 'status' },
	{ label: 'Method', sortBy: 'paymentType' },
	{ label: 'Amount', sortBy: 'amount' },
	{ label: 'Total', sortBy: 'totalAmount' },
	{ label: 'Created', sortBy: 'createdAt' },
] as const satisfies ReadonlyArray<{ label: string; sortBy: SortField }>;

const formatCurrency = (value: number) =>
	new Intl.NumberFormat('en-US', { style: 'decimal' }).format(value);

const formatDate = (value: string) =>
	new Intl.DateTimeFormat('ru-RU', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(new Date(value));

export const PaymentsTable = ({
	payments,
	isLoading,
	sortBy,
	sortOrder,
	onSortChange,
}: PaymentsTableProps) => (
	<div className='border-ctp-surface1 bg-ctp-surface0 max-w-full min-w-0 overflow-x-auto rounded-md border'>
		<Table className='text-ctp-text w-full min-w-5xl table-fixed'>
			<colgroup>
				<col style={{ width: '5rem' }} />
				<col style={{ width: '7rem' }} />
				<col style={{ width: '10rem' }} />
				<col style={{ width: '10rem' }} />
				<col style={{ width: '10rem' }} />
				<col style={{ width: '10rem' }} />
				<col style={{ width: '13rem' }} />
			</colgroup>
			<Table.Head>
				<Table.Row className='bg-ctp-surface1/60 text-ctp-subtext0'>
					{columns.map((column) => {
						const isSorted = sortBy === column.sortBy;
						return (
							<Table.HeaderCell
								key={column.sortBy}
								isSortable
								isSorted={isSorted ? sortOrder : undefined}
								aria-sort={
									isSorted
										? sortOrder === 'asc'
											? 'ascending'
											: 'descending'
										: 'none'
								}
							>
								<button
									type='button'
									className='focus-visible:ring-ctp-blue rounded-sm focus-visible:ring-2 focus-visible:outline-none'
									aria-label={`Sort by ${column.label}`}
									onClick={() => onSortChange(column.sortBy)}
								>
									{column.label}
								</button>
							</Table.HeaderCell>
						);
					})}
				</Table.Row>
			</Table.Head>

			{isLoading ? (
				<Table.Skeleton rows={8} columns={columns.length} />
			) : (
				<Table.Body>
					{payments?.length ? (
						payments.map((payment) => (
							<Table.Row key={payment.id}>
								<Table.Cell>#{payment.id}</Table.Cell>
								<Table.Cell>#{payment.orderId}</Table.Cell>
								<Table.Cell>{payment.status}</Table.Cell>
								<Table.Cell>{payment.paymentType}</Table.Cell>
								<Table.Cell>{formatCurrency(payment.amount)}</Table.Cell>
								<Table.Cell>{formatCurrency(payment.totalAmount)}</Table.Cell>
								<Table.Cell>{formatDate(payment.createdAt)}</Table.Cell>
							</Table.Row>
						))
					) : (
						<Table.EmptyState colSpan={columns.length}>
							No payments found.
						</Table.EmptyState>
					)}
				</Table.Body>
			)}
		</Table>
	</div>
);
