import { Table } from '@/shared/components/table';
import { UserQueryDto } from '@servemate/shared-dto';
import { UserTableRow } from './UserTableRow';
import { UsersListItem } from './UsersList';

interface UserTableBodyProps {
	users?: UsersListItem[];
	isLoading?: boolean;
	sortBy?: UserQueryDto['sortBy'];
	onDelete: (userId: number) => void;
}

export const UserTableBody = ({ users, isLoading, sortBy, onDelete }: UserTableBodyProps) => (
	<Table.Body>
		{users && users.length > 0 ? (
			users.map((user) => (
				<UserTableRow
					key={'user-table' + user.id}
					user={user}
					sortBy={sortBy}
					onDelete={onDelete}
				/>
			))
		) : (
			<Table.EmptyState colSpan={7}>No users found for the current filters.</Table.EmptyState>
		)}
	</Table.Body>
);
