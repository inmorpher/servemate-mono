'use client';

import { Table } from '@/shared/components/table';
import type { DrinkItem, DrinkSearchCriteria } from '../types';

type SortField = NonNullable<DrinkSearchCriteria['sortBy']>;

interface DrinksTableProps {
	drinks: DrinkItem[] | undefined;
	isLoading?: boolean;
	sortBy?: DrinkSearchCriteria['sortBy'];
	sortOrder?: DrinkSearchCriteria['sortOrder'];
	onSortChange: (sortBy: SortField) => void;
}

const columns: ReadonlyArray<{ label: string; sortBy?: SortField }> = [
	{ label: 'ID', sortBy: 'id' },
	{ label: 'Name', sortBy: 'name' },
	{ label: 'Category', sortBy: 'category' },
	{ label: 'Price', sortBy: 'price' },
	{ label: 'Volume', sortBy: 'volume' },
	{ label: 'Alcohol' },
	{ label: 'Temperature' },
	{ label: 'Availability', sortBy: 'isAvailable' },
	{ label: 'Ingredients' },
];

export const DrinksTable = ({
	drinks,
	isLoading,
	sortBy,
	sortOrder,
	onSortChange,
}: DrinksTableProps) => (
	<div className='border-ctp-surface1 bg-ctp-surface0 max-w-full min-w-0 overflow-x-auto rounded-md border'>
		<Table className='text-ctp-text w-full min-w-5xl table-fixed'>
			<colgroup>
				<col style={{ width: '5rem' }} />
				<col style={{ width: '12rem' }} />
				<col style={{ width: '9rem' }} />
				<col style={{ width: '7rem' }} />
				<col style={{ width: '7rem' }} />
				<col style={{ width: '7rem' }} />
				<col style={{ width: '9rem' }} />
				<col style={{ width: '9rem' }} />
				<col style={{ width: '14rem' }} />
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
					{drinks?.length ? (
						drinks.map((drink) => (
							<Table.Row key={drink.id}>
								<Table.Cell>{drink.id}</Table.Cell>
								<Table.Cell>{drink.name}</Table.Cell>
								<Table.Cell>{drink.category}</Table.Cell>
								<Table.Cell>{drink.price}</Table.Cell>
								<Table.Cell>{drink.volume}</Table.Cell>
								<Table.Cell>
									{drink.alcoholPercentage === undefined
										? '—'
										: `${drink.alcoholPercentage}%`}
								</Table.Cell>
								<Table.Cell>{drink.tempriture}</Table.Cell>
								<Table.Cell>
									{drink.isAvailable === undefined
										? '—'
										: drink.isAvailable
											? 'Available'
											: 'Unavailable'}
								</Table.Cell>
								<Table.Cell>{drink.ingredients?.join(', ') || '—'}</Table.Cell>
							</Table.Row>
						))
					) : (
						<Table.EmptyState colSpan={columns.length}>
							No drinks found.
						</Table.EmptyState>
					)}
				</Table.Body>
			)}
		</Table>
	</div>
);
