import { UserSearchCriteria, UserSortColumn } from '@servemate/dto';
import { Pencil, Trash2 } from 'lucide-react';

export const USERS_TABLE_COLUMNS = [
	{ label: 'ID', sortBy: UserSortColumn.ID, width: '5rem' },
	{ label: 'Name', sortBy: UserSortColumn.NAME, width: '9rem' },
	{ label: 'Email', sortBy: UserSortColumn.EMAIL, width: '17rem' },
	{ label: 'Role', sortBy: UserSortColumn.ROLE, width: '8rem' },
	{ label: 'Created', sortBy: UserSortColumn.CREATED_AT, width: '17rem' },
	{ label: 'Updated', sortBy: UserSortColumn.UPDATED_AT, width: '17rem' },
] as const satisfies ReadonlyArray<{
	label: string;
	sortBy?: NonNullable<UserSearchCriteria['sortBy']>;
	width: string;
}>;

export const USER_ACTIONS = [
	{ id: 'edit', label: 'Edit', icon: Pencil, variant: 'default' },
	{ id: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive' },
] as const;

export const USER_COLUMN_COUNT = USERS_TABLE_COLUMNS.length + 1; // +1 for the actions column
