interface SearchInputProps {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	isLoading?: boolean;
	placeholder?: string;
}

/**
 * Renders a search input component with an integrated search icon and a submit button.
 *
 * @remarks
 * - The input field is styled with Tailwind CSS classes and displays a search icon inside the input.
 * - The submit button displays a loading spinner and "Searching..." text when `isLoading` is true, otherwise shows a search icon and "Find".
 * - The button is disabled while loading.
 * - This component should be used within a `SearchWrapper` or a form container to handle submission and layout.
 *
 * @param value - The current value of the search input.
 * @param onChange - Callback function invoked when the input value changes. Receives the input change event.
 * @param isLoading - Boolean indicating whether a search operation is in progress.
 *
 * @returns A React functional component rendering a styled search input and submit button.
 *
 * @example
 * ```tsx
 * <SearchWrapper>
 *   <SearchInput
 *     value={searchTerm}
 *     onChange={handleSearchChange}
 *     isLoading={isSearching}
 *   />
 * </SearchWrapper>
 * ```
 */
export const SearchInput = ({ value, onChange, isLoading, placeholder }: SearchInputProps) => {
	return (
		<div className='flex items-center gap-3'>
			<div className='relative grow'>
				<input
					type='text'
					name='search'
					placeholder={placeholder || 'Search...'}
					aria-label='Search input'
					value={value}
					onChange={(event) => onChange(event)}
					className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:ring-ctp-blue w-full rounded-lg border px-4 py-2 pl-10 text-sm focus:border-transparent focus:ring-2 focus:outline-none'
				/>
				<svg
					className='text-ctp-subtext0 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
					/>
				</svg>
			</div>

			<button
				type='submit'
				disabled={isLoading}
				className='bg-ctp-blue text-ctp-base hover:bg-ctp-sapphire flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
			>
				{isLoading ? (
					<>
						<div className='border-ctp-base h-4 w-4 animate-spin rounded-full border-b-2'></div>
						<span>Searching...</span>
					</>
				) : (
					<>
						<svg
							className='h-4 w-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							/>
						</svg>
						<span>Find</span>
					</>
				)}
			</button>
		</div>
	);
};
