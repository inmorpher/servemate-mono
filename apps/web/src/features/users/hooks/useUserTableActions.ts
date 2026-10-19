import { useState } from 'react';
import { UsersListItem } from '../ui/table/UsersList';
import { useDeleteUser } from './useDeleteUser';

export interface UseUserTableActionsReturn {
	userToDelete: UsersListItem['id'] | null;
	handleDeleteClick: (userId: number) => void;
	handleConfirmDelete: () => Promise<void>;
	handleCloseDialog: () => void;
}

export const useUserTableActions = (): UseUserTableActionsReturn => {
	const { mutateAsync: deleteUser } = useDeleteUser();
	const [userToDelete, setUserToDelete] = useState<UsersListItem['id'] | null>(null);

	// Once we set the user to delete, it will open the delete dialog. If we cancel the delete, we need to reset the userToDelete state to null.
	const handleDeleteClick = (userId: number) => {
		setUserToDelete(userId);
	};

	const handleConfirmDelete = async () => {
		if (!userToDelete) return;

		await deleteUser({ id: String(userToDelete) });
		setUserToDelete(null);
	};

	const handleCloseDialog = () => {
		setUserToDelete(null);
	};

	return {
		userToDelete,
		handleDeleteClick,
		handleConfirmDelete,
		handleCloseDialog,
	};
};
