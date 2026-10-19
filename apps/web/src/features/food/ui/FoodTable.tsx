'use client';

import { Table } from '@/shared/components/table';
import type { FoodItem, FoodSearchCriteria } from '../types';

type SortField = NonNullable<FoodSearchCriteria['sortBy']>;

interface FoodTableProps {
	items: FoodItem[] | undefined;
	isLoading?: boolean;
	sortBy?: FoodSearchCriteria['sortBy'];
	sortOrder?: FoodSearchCriteria['sortOrder'];
	onSortChange: (sortBy: SortField) => void;
}

const columns = [
	{ label: 'ID', sortBy: 'id' },
	{ label: 'Dish', sortBy: 'name' },
	{ label: 'Category', sortBy: 'category' },
	{ label: 'Type', sortBy: 'type' },
	{ label: 'Price', sortBy: 'price' },
	{ label: 'Availability', sortBy: 'isAvailable' },
	{ label: 'Dietary', sortBy: 'isVegan' },
	{ label: 'Preparation', sortBy: 'preparationTime' },
	{ label: 'Calories', sortBy: 'calories' },
	{ label: 'Spicy level', sortBy: 'spicyLevel' },
	{ label: 'Allergies', sortBy: 'allergies' },
	{ label: 'Ingredients', sortBy: 'ingredients' },
] as const satisfies ReadonlyArray<{ label: string; sortBy: SortField }>;

export const FoodTable = ({
	items,
	isLoading,
	sortBy,
	sortOrder,
	onSortChange,
}: FoodTableProps) => (
	<div className='border-ctp-surface1 bg-ctp-surface0 max-w-full min-w-0 overflow-x-auto rounded-md border'>
		<Table className='text-ctp-text w-full min-w-[76rem] table-fixed'>
			<colgroup>
				<col style={{ width: '4rem' }} />
				<col style={{ width: '15rem' }} />
				<col style={{ width: '9rem' }} />
				<col style={{ width: '8rem' }} />
				<col style={{ width: '7rem' }} />
				<col style={{ width: '8rem' }} />
				<col style={{ width: '15rem' }} />
				<col style={{ width: '9rem' }} />
				<col style={{ width: '7rem' }} />
				<col style={{ width: '8rem' }} />
				<col style={{ width: '13rem' }} />
				<col style={{ width: '18rem' }} />
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
									className='focus-visible:ring-ctp-blue min-h-10 rounded-sm focus-visible:ring-2 focus-visible:outline-none'
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
					{items?.length ? (
						items.map((item) => (
							<Table.Row key={item.id}>
								<Table.Cell>{item.id}</Table.Cell>
								<Table.Cell>
									<div className='min-w-0'>
										<p className='truncate font-medium'>{item.name}</p>
										<p className='text-ctp-subtext0 truncate text-xs'>
											{item.description}
										</p>
									</div>
								</Table.Cell>
								<Table.Cell>{item.category}</Table.Cell>
								<Table.Cell>{item.type}</Table.Cell>
								<Table.Cell>{item.price}</Table.Cell>
								<Table.Cell>
									{item.isAvailable === undefined
										? '—'
										: item.isAvailable
											? 'Available'
											: 'Unavailable'}
								</Table.Cell>
								<Table.Cell>
									{[
										item.isVegan ? 'Vegan' : undefined,
										item.isVegetarian ? 'Vegetarian' : undefined,
										item.isGlutenFree ? 'Gluten-free' : undefined,
									]
										.filter(Boolean)
										.join(', ') || '—'}
								</Table.Cell>
								<Table.Cell>
									{item.preparationTime === undefined
										? '—'
										: `${item.preparationTime} min`}
								</Table.Cell>
								<Table.Cell>{item.calories ?? '—'}</Table.Cell>
								<Table.Cell>{item.spicyLevel ?? '—'}</Table.Cell>
								<Table.Cell>{item.allergies?.join(', ') || '—'}</Table.Cell>
								<Table.Cell>{item.ingredients?.join(', ') || '—'}</Table.Cell>
							</Table.Row>
						))
					) : (
						<Table.EmptyState colSpan={columns.length}>
							No food items found.
						</Table.EmptyState>
					)}
				</Table.Body>
			)}
		</Table>
	</div>
);
