import { ReactNode } from 'react';

interface SearchContainerProps {
	children: ReactNode;
	onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * A container component that wraps its children within a styled `<form>` element.
 *
 * @remarks
 * This component is typically used to provide a consistent layout and styling for search forms.
 * It accepts any valid React nodes as children and handles form submission via the `onSubmit` prop.
 *
 * @param children - The React nodes to be rendered inside the form. Usually, these are input fields, buttons, or other form controls.
 * @param onSubmit - The event handler function to be called when the form is submitted. Should accept a `React.FormEvent<HTMLFormElement>`.
 *
 * @example
 * ```tsx
 * <SearchContainer onSubmit={handleSearch}>
 *   <input type="text" name="query" />
 *   <button type="submit">Search</button>
 * </SearchContainer>
 * ```
 */
export const SearchContainer = ({ children, onSubmit }: SearchContainerProps) => {
	return (
		<form className='space-y-4 py-4 px-6 top-0 z-10 w-full mb-4' onSubmit={onSubmit}>
			{children}
		</form>
	);
};
