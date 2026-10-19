interface PageSizzeSelectProps {
	value: number;
	onChange: (size: number) => void;
	options?: number[];
}

/**
 * A select dropdown component for choosing the number of items to display per page.
 * @param value - The currently selected page size
 * @param onChange - Callback function invoked when the page size selection changes, receives the new size as a number
 * @param options - Array of available page size options. Defaults to [5, 10, 20, 50]
 * @returns A select element with pagination size options
 */
export const PageSizeSelect = ({
	value,
	onChange,
	options = [5, 10, 20, 50],
}: PageSizzeSelectProps) => {
	return (
		<select
			value={value}
			onChange={(e) => onChange(Number(e.target.value))}
			aria-label='Select number of items per page'
			className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text corner-squircle h-12 rounded-md border px-2 py-1 text-sm md:h-8'
		>
			{options.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	);
};
