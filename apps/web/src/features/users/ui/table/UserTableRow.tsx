import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { Table } from '@/shared/components/table';
import { UserListItem, UserSearchCriteria, UserSortColumn } from '@servemate/dto';
import { Trash2 } from 'lucide-react';
import { formatDate, getRoleColor } from '../../utils/userHelpers';

interface UserTableRowProps {
	user: UserListItem;
	sortBy?: UserSearchCriteria['sortBy'];
	onDelete: (userId: number) => void;
}

export const UserTableRow = ({ user, sortBy, onDelete }: UserTableRowProps) => {
	const isActiveColumn = (columnSortBy?: UserSearchCriteria['sortBy']) => sortBy === columnSortBy;

	return (
		<Table.Row key={user.id}>
			<Table.Cell data-active={isActiveColumn(UserSortColumn.ID)}>{user.id}</Table.Cell>
			<Table.Cell data-active={isActiveColumn(UserSortColumn.NAME)}>{user.name}</Table.Cell>
			<Table.Cell data-active={isActiveColumn(UserSortColumn.EMAIL)}>
				{user.email.toLowerCase()}
			</Table.Cell>
			<Table.Cell
				className={getRoleColor(user.role, 'text')}
				data-active={isActiveColumn(UserSortColumn.ROLE)}
			>
				{user.role}
			</Table.Cell>

			<Table.Cell
				className='text-ctp-subtext0 text-sm'
				data-active={isActiveColumn(UserSortColumn.CREATED_AT)}
			>
				{formatDate(user.createdAt)}
			</Table.Cell>
			<Table.Cell
				className='text-ctp-subtext0 text-sm'
				data-active={isActiveColumn(UserSortColumn.UPDATED_AT)}
			>
				{formatDate(user.updatedAt)}
			</Table.Cell>
			<Table.Cell truncate={false}>
				<ActionMenu
					orientation='horizontal'
					items={[
						{
							label: 'Delete user',
							icon: <Trash2 className='h-4 w-4' />,
							onClick: () => {
								onDelete(user.id);
							},
							variant: 'destructive',
						},
					]}
					ariaLabel={`Actions for user #${user.id}`}
				/>
			</Table.Cell>
		</Table.Row>
	);
};
