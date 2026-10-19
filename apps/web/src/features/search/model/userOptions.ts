import { UserRole, UserSortColumn } from '@servemate/dto';

/**
 * Provides configuration options for searching users.
 *
 * @property roles - An array of role options, each with a `label` and `value`, generated from the `UserRole` enum.
 * @property statuses - An array of status options for filtering users by their active state.
 * @property sortOptions - An array of sorting options, each with a `label` and `value`, generated from the `UserSortColumn` enum.
 */
export const userSearchOptions = {
	roles: [
		...Object.entries(UserRole).map(([key, value]) => ({
			label: key,
			value: value,
		})),
	],
	statuses: [
		{ label: 'Active', value: 'true' },
		{ label: 'Not active', value: 'false' },
	],
	sortOptions: [
		...Object.entries(UserSortColumn).map(([key, value]) => ({
			label: key,
			value: value,
		})),
	],
};
