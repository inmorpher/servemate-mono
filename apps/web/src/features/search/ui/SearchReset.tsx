interface SearchResetProps {
	onReset: () => void;
}

/**
 * Renders a reset button for search functionality.
 *
 * @param {SearchResetProps} props - The props for the SearchReset component.
 * @param {() => void} props.onReset - Callback function invoked when the reset button is clicked.
 * @returns {JSX.Element} The rendered reset button component.
 */
export const SearchReset = ({ onReset }: SearchResetProps) => {
	return (
		<button
			type='button'
			onClick={onReset}
			className='px-3 py-1.5 text-sm text-ctp-red hover:bg-ctp-red hover:bg-opacity-10 rounded-md transition-colors hover:text-white cursor-pointer'
		>
			Reset
		</button>
	);
};
