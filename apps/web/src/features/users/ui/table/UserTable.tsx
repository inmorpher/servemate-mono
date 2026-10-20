'use client';

import { Table } from '@/shared/components/table';
import { UserListItem, UserQueryDto } from '@servemate/shared-dto';
import { USER_COLUMN_COUNT } from '../../config/table-config';
import { UserTableHead } from './UserTableHead';
import { UserTableBody } from './UsersTableBody';
import { UsersTableColGroup } from './UsersTableColGroup';

export interface UsersTableProps {
	isLoading?: boolean;
	users: UserListItem[] | undefined;
	sortBy?: UserQueryDto['sortBy'];
	sortOrder?: UserQueryDto['sortOrder'];
	onSortChange: (sortBy: NonNullable<UserQueryDto['sortBy']>) => void;
	onEditUser?: (user: UserListItem) => void;
	onDeleteUser?: (userId: number) => void;
}

export const UsersTable = ({
	isLoading,
	users,
	sortBy,
	sortOrder,
	onSortChange,

	onDeleteUser,
}: UsersTableProps) => (
	<div className='border-ctp-surface1 shadow-soft max-w-full min-w-0 overflow-x-auto overflow-y-auto border'>
		<Table className='text-ctp-text w-full min-w-230 table-fixed'>
			<UsersTableColGroup />
			{isLoading ? (
				<Table.Skeleton rows={10} columns={USER_COLUMN_COUNT} />
			) : (
				<>
					<UserTableHead
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSortChange={onSortChange}
					/>
					<UserTableBody
						users={users}
						isLoading={isLoading}
						sortBy={sortBy}
						onDelete={onDeleteUser ? onDeleteUser : () => {}}
					/>
				</>
			)}
		</Table>
	</div>
);
