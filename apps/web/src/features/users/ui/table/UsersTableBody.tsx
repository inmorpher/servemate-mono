import { Table } from '@/shared/components/table';
import { UserSearchCriteria } from '@servemate/dto';
import { UserTableRow } from './UserTableRow';
import { UsersListItem } from './UsersList';

interface UserTableBodyProps {
	users?: UsersListItem[];
	isLoading?: boolean;
	sortBy?: UserSearchCriteria['sortBy'];
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
