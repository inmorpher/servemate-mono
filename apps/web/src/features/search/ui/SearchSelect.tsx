import { pluralize } from '@/shared/utils/pliralize';

type SelectOption = string | number | { label: string; value: string | number | boolean };

interface SearchSelectProps {
	name: string;
	value: string | number | undefined;
	onChange: (key: string, value: unknown) => void;
	options: SelectOption[];
	defaultOption?: boolean;
}

const getOptionValue = (option: SelectOption) => {
	return typeof option === 'object' ? option.value : option;
};

const getOptionLabel = (option: SelectOption) => {
	return typeof option === 'object' ? option.label : option;
};

/**
 * A reusable select dropdown component for search filters.
 *
 * Renders a styled `<select>` element with options, supporting a default "All" option and custom option rendering.
 * Triggers `onChange` with the selected value and field name.
 *
 * @remarks
 * This component is intended to be used within a form or `SearchContainer` for search/filter functionality.
 *
 * @param name - The name of the select field.
 * @param value - The currently selected value.
 * @param onChange - Callback invoked when the selection changes. Receives the field name and new value.
 * @param options - Array of options to display in the dropdown.
 * @param defaultOption - If true, includes a default "All" option at the top of the list.
 */
export const SearchSelect = ({
	name,
	value,
	onChange,
	options,
	defaultOption,
}: SearchSelectProps) => {
	return (
		<select
			name={name}
			aria-label={`Select ${name}`}
			onChange={(event) => {
				const val = event.target.value;
				onChange(name, val);
			}}
			value={value?.toString() || ''}
			className='px-3 py-1.5 text-sm bg-ctp-surface0 border border-ctp-surface1 rounded-md text-ctp-text focus:outline-none focus:ring-2 focus:ring-ctp-blue cursor-pointer'
		>
			{/* If defaultOption is true and value is undefined or empty, show the default "All" option */}
			{defaultOption && <option value=''>{`All ${pluralize(name)}`.toUpperCase()}</option>}

			{options.map((option) => {
				const optionValue = getOptionValue(option);
				const optionLabel = getOptionLabel(option);

				return (
					<option key={`select-${optionLabel}`} value={optionValue.toString()}>
						{optionLabel.toString().toUpperCase()}
					</option>
				);
			})}
		</select>
	);
};
