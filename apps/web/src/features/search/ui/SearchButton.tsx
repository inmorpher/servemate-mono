import { Button } from '@/shared/components/button';

interface SearchSortTogglerProps {
	sortOptions: string | undefined;
	onClick: () => void;
}

/**
 * A button component that toggles the sorting order between ascending and descending.
 *
 * Displays an arrow and label indicating the current sort direction ("Asc." or "Desc.").
 * Triggers the provided `onClick` handler when pressed.
 *
 * @remarks
 * This component is intended to be used within a form or a Search container to control sorting of search results.
 *
 * @param sortOptions - The current sort order, either `'asc'` or `'desc'`.
 * @param onClick - Callback function invoked when the button is clicked to toggle the sort order.
 *
 * @example
 * ```tsx
 * <form>
 *   <SearchSortToggler sortOptions={sortOrder} onClick={toggleSortOrder} />
 * </form>
 * ```
 */
export const SearchSortToggler = ({ sortOptions, onClick }: SearchSortTogglerProps) => {
	return (
		<Button variant='outline' type='button' onClick={onClick} className='' size={'sm'}>
			{sortOptions === 'desc' ? '↓' : '↑'}
			{sortOptions === 'desc' ? 'Desc.' : 'Asc.'}
		</Button>
	);
};
