import { USERS_TABLE_COLUMNS } from '../../config/table-config';

/**
 * Renders the column group for the users table.
 *
 * This component maps over the configured table columns and renders a
 * corresponding <col> element for each column, plus an additional auto-width
 * column for actions or overflow content.
 */
export const UsersTableColGroup = () => (
	<colgroup>
		{USERS_TABLE_COLUMNS.map((column) => (
			<col key={column.label} style={{ width: column.width }} />
		))}
		<col style={{ width: '4rem' }} />
	</colgroup>
);
