'use client';

import { UserListItem, UserListResult, UserSearchCriteria } from '@servemate/dto';
import { useState } from 'react';
import { DeleteUserDialog } from '../DeleteUserDialog';
import { UsersTable } from './UserTable';

export type UsersListItem = UserListResult['users'][number];

export interface UsersListProps {
	isLoading?: boolean;
	users: UsersListItem[] | undefined;
	sortBy?: UserSearchCriteria['sortBy'];
	sortOrder?: UserSearchCriteria['sortOrder'];
	onSortChange: (sortBy: NonNullable<UserSearchCriteria['sortBy']>) => void;
	onEditUser?: (user: UserListItem) => void;
}

export const UsersList = ({
	isLoading,
	users,
	sortBy,
	sortOrder,
	onSortChange,
	onEditUser,
}: UsersListProps) => {
	const [deleteState, setDeleteState] = useState<{
		isOpen: boolean;
		userId?: number;
	}>({ isOpen: false });

	const handleDeleteClick = (userId: number | string) => {
		setDeleteState({ isOpen: true, userId: Number(userId) });
	};

	return (
		<>
			<UsersTable
				isLoading={isLoading}
				users={users}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSortChange={onSortChange}
				onEditUser={onEditUser}
				onDeleteUser={handleDeleteClick}
			/>

			<DeleteUserDialog
				user={deleteState.userId ? { id: deleteState.userId } : null}
				isOpen={deleteState.isOpen}
				onOpenChange={(isOpen) =>
					!isOpen && setDeleteState({ isOpen: false, userId: undefined })
				}
			/>
		</>
	);
};
