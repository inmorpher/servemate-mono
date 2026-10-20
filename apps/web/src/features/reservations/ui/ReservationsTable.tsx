'use client';

import { Table } from '@/shared/components/table';
import type { ReservationListItem, ReservationSearchCriteria } from '../types';

type SortField = NonNullable<ReservationSearchCriteria['sortBy']>;

interface ReservationsTableProps {
	reservations: ReservationListItem[] | undefined;
	isLoading?: boolean;
	canQuery: boolean;
	sortBy?: ReservationSearchCriteria['sortBy'];
	sortOrder?: ReservationSearchCriteria['sortOrder'];
	onSortChange: (sortBy: SortField) => void;
}

const columns: ReadonlyArray<{ label: string; sortBy?: SortField }> = [
	{ label: 'ID', sortBy: 'id' },
	{ label: 'Guest' },
	{ label: 'Phone' },
	{ label: 'Guests', sortBy: 'guestsCount' },
	{ label: 'Time', sortBy: 'time' },
	{ label: 'Tables' },
	{ label: 'Status', sortBy: 'status' },
];

const formatReservationTime = (value: string | Date) =>
	new Intl.DateTimeFormat('ru-RU', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(new Date(value));

export const ReservationsTable = ({
	reservations,
	isLoading,
	canQuery,
	sortBy,
	sortOrder,
	onSortChange,
}: ReservationsTableProps) => (
	<div className='border-ctp-surface1 bg-ctp-surface0 max-w-full min-w-0 overflow-x-auto rounded-md border'>
		<Table className='text-ctp-text w-full min-w-3xl table-fixed'>
			<colgroup>
				<col style={{ width: '5rem' }} />
				<col style={{ width: '13rem' }} />
				<col style={{ width: '10rem' }} />
				<col style={{ width: '6rem' }} />
				<col style={{ width: '12rem' }} />
				<col style={{ width: '8rem' }} />
				<col style={{ width: '8rem' }} />
			</colgroup>
			<Table.Head>
				<Table.Row className='bg-ctp-surface1/60 text-ctp-subtext0'>
					{columns.map((column) => {
						if (column.sortBy === undefined) {
							return <Table.HeaderCell key={column.label}>{column.label}</Table.HeaderCell>;
						}
						const columnSortBy = column.sortBy;
						const isSorted = sortBy === columnSortBy;
						return (
							<Table.HeaderCell
								key={column.label}
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
									onClick={() => onSortChange(columnSortBy)}
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
					{!canQuery ? (
						<Table.EmptyState colSpan={columns.length}>
							Choose a status and table to load reservations.
						</Table.EmptyState>
					) : reservations?.length ? (
						reservations.map((reservation) => (
							<Table.Row key={reservation.id}>
								<Table.Cell>#{reservation.id}</Table.Cell>
								<Table.Cell>{reservation.name}</Table.Cell>
								<Table.Cell>{reservation.phone}</Table.Cell>
								<Table.Cell>{reservation.guestsCount}</Table.Cell>
								<Table.Cell>{formatReservationTime(reservation.time)}</Table.Cell>
								<Table.Cell>
									{reservation.tables.length
										? reservation.tables
												.map((table) => `#${table.tableNumber}`)
												.join(', ')
										: '—'}
								</Table.Cell>
								<Table.Cell>
									<span className='border-ctp-surface1 bg-ctp-surface1/50 inline-flex max-w-full truncate rounded-full border px-2.5 py-1 text-xs font-medium'>
										{reservation.status}
									</span>
								</Table.Cell>
							</Table.Row>
						))
					) : (
						<Table.EmptyState colSpan={columns.length}>
							No reservations found.
						</Table.EmptyState>
					)}
				</Table.Body>
			)}
		</Table>
	</div>
);
