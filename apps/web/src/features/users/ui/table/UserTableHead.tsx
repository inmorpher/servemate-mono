import { Button } from '@/shared/components/button';
import { Table } from '@/shared/components/table';
import { UserSearchCriteria } from '@servemate/dto';
import { USERS_TABLE_COLUMNS } from '../../config/table-config';

interface UserTableHeadProps {
	sortBy?: UserSearchCriteria['sortBy'];
	sortOrder?: UserSearchCriteria['sortOrder'];
	onSortChange: (sortBy: NonNullable<UserSearchCriteria['sortBy']>) => void;
}

export const UserTableHead = ({ sortBy, sortOrder, onSortChange }: UserTableHeadProps) => {
	const isActiveColumn = (columnSortBy?: UserSearchCriteria['sortBy']) => sortBy === columnSortBy;

	return (
		<Table.Head>
			<Table.Row className='bg-ctp-surface1/60 text-ctp-subtext0 divide-amber-50 p-0'>
				{USERS_TABLE_COLUMNS.map((column) => {
					const isActiveSort = isActiveColumn(column.sortBy);
					return (
						<Table.HeaderCell
							key={column.label}
							isSortable={Boolean(column.sortBy)}
							isSorted={isActiveSort ? (sortOrder ?? undefined) : undefined}
							data-active={isActiveSort}
							onClick={() => {
								if (column.sortBy) {
									onSortChange(column.sortBy);
								}
							}}
							className='group/column'
						>
							<Button variant='ghost' size='bare' className='h-10 w-full px-0 py-0'>
								{column.label}
							</Button>
						</Table.HeaderCell>
					);
				})}
				<Table.HeaderCell className='w-15' key={'column-actions'}>
					<span className='sr-only'>actions</span>
				</Table.HeaderCell>
			</Table.Row>
		</Table.Head>
	);
};
