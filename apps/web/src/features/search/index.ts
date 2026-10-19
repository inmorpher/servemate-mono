import { SearchSortToggler } from './ui/SearchButton';
import { SearchChip } from './ui/SearchChip';
import { SearchContainer } from './ui/SearchContainer';
import { SearchInput } from './ui/SearchInput';
import { SearchReset } from './ui/SearchReset';
import { SearchSelect } from './ui/SearchSelect';
import { SearchWrapper } from './ui/SearchWrapper';
export * from './model/userOptions';

/**
 * The `Search` component is a composite object that combines the main `SearchContainer` component
 * with several related subcomponents for building a search UI.
 *
 * @remarks
 * This object uses `Object.assign` to attach the following subcomponents as static properties:
 * - `Wrapper`: The wrapper component for the search UI.
 * - `Input`: The input field component for search queries.
 * - `Select`: The select dropdown component for filtering or sorting.
 * - `Button`: The button component for toggling sort options.
 * - `Reset`: The button component for resetting the search.
 *
 * @example
 * ```tsx
 * <Search.Wrapper>
 *   <Search.Input />
 *   <Search.Select />
 *   <Search.Button />
 *   <Search.Reset />
 * </Search.Wrapper>
 * ```
 */
export const Search = Object.assign(SearchContainer, {
	Wrapper: SearchWrapper,
	Input: SearchInput,
	Select: SearchSelect,
	Button: SearchSortToggler,
	Reset: SearchReset,
	Chip: SearchChip,
});
