'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from '@/shared/components/alert-dialog/AlertDialog';
import { Button } from '@/shared/components/button';
import { UserListItem } from '@servemate/dto';
import { useDeleteUser } from '../hooks/useDeleteUser';

interface DeleteUserDialogProps {
	/** The user to delete, or null if no user is selected. */
	user: Pick<UserListItem, 'id'> | null;
	/** Whether the dialog is open. */
	isOpen: boolean;
	/** Callback to change the open state of the dialog. */
	onOpenChange: (isOpen: boolean) => void;
	/** Optional callback invoked when the user is successfully deleted. */
	onSuccess?: () => void;
}

/**
 * A dialog for confirming the deletion of a user.
 *
 * @param user - The user to delete, or null if no user is selected.
 * @param isOpen - Whether the dialog is open.
 * @param onOpenChange - Callback to change the open state of the dialog.
 * @param onSuccess - Optional callback invoked when the user is successfully deleted.
 */
export const DeleteUserDialog = ({
	user,
	isOpen,
	onOpenChange,
	onSuccess,
}: DeleteUserDialogProps) => {
	const { mutateAsync: deleteUser } = useDeleteUser();

	const handleConfirmDelete = async () => {
		if (!user) return;

		await deleteUser({ id: String(user.id) });
		onOpenChange(false);
		onSuccess?.();
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogTitle>Delete user?</AlertDialogTitle>
				<AlertDialogDescription>
					Are you sure you want to delete user #{user?.id}? This action cannot be undone.
				</AlertDialogDescription>

				<div className='flex justify-end gap-2'>
					<AlertDialogCancel asChild>
						<Button variant='ghost' size='sm'>
							Cancel
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button variant='destructive' size='sm' onClick={handleConfirmDelete}>
							Delete
						</Button>
					</AlertDialogAction>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
};
