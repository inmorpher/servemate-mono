'use client';

import { Table } from '@/shared/components/table';
import type { RestaurantTable, TableSearchCriteria } from '../types';

type SortField = NonNullable<TableSearchCriteria['sortBy']>;

interface TablesTableProps {
	tables: RestaurantTable[] | undefined;
	isLoading?: boolean;
	canQuery: boolean;
	sortBy?: TableSearchCriteria['sortBy'];
	sortOrder?: TableSearchCriteria['sortOrder'];
	onSortChange: (sortBy: SortField) => void;
}

const columns: ReadonlyArray<{ label: string; sortBy?: SortField }> = [
	{ label: 'ID', sortBy: 'id' },
	{ label: 'Table', sortBy: 'tableNumber' },
	{ label: 'Status', sortBy: 'status' },
	{ label: 'Occupancy', sortBy: 'isOccupied' },
	{ label: 'Guests', sortBy: 'guests' },
	{ label: 'Capacity', sortBy: 'capacity' },
	{ label: 'Original capacity' },
	{ label: 'Additional capacity' },
];

export const TablesTable = ({
	tables,
	isLoading,
	canQuery,
	sortBy,
	sortOrder,
	onSortChange,
}: TablesTableProps) => (
	<div className='border-ctp-surface1 bg-ctp-surface0 max-w-full min-w-0 overflow-x-auto rounded-md border'>
		<Table className='text-ctp-text w-full min-w-5xl table-fixed'>
			<colgroup>
				<col style={{ width: '5rem' }} />
				<col style={{ width: '7rem' }} />
				<col style={{ width: '10rem' }} />
				<col style={{ width: '10rem' }} />
				<col style={{ width: '7rem' }} />
				<col style={{ width: '8rem' }} />
				<col style={{ width: '12rem' }} />
				<col style={{ width: '13rem' }} />
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
									className='focus-visible:ring-ctp-blue min-h-10 rounded-sm focus-visible:ring-2 focus-visible:outline-none'
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
							Choose a status and occupancy to load tables.
						</Table.EmptyState>
					) : tables?.length ? (
						tables.map((table) => (
							<Table.Row key={table.id}>
								<Table.Cell>#{table.id}</Table.Cell>
								<Table.Cell>#{table.tableNumber}</Table.Cell>
								<Table.Cell>{table.status}</Table.Cell>
								<Table.Cell>
									{table.isOccupied ? 'Occupied' : 'Not occupied'}
								</Table.Cell>
								<Table.Cell>{table.guests}</Table.Cell>
								<Table.Cell>{table.capacity}</Table.Cell>
								<Table.Cell>{table.originalCapacity}</Table.Cell>
								<Table.Cell>{table.additionalCapacity}</Table.Cell>
							</Table.Row>
						))
					) : (
						<Table.EmptyState colSpan={columns.length}>
							No tables found.
						</Table.EmptyState>
					)}
				</Table.Body>
			)}
		</Table>
	</div>
);
