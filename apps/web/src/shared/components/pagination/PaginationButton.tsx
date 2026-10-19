import { cn } from '@/shared/utils/classNames';
import { Button, ButtonProps } from '../button';

interface PaginationButtonProps extends ButtonProps {
	isActive?: boolean;
	isPrevNext?: boolean;
}

/**
 * A pagination button component that adapts its appearance based on state.
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.isActive - Determines if the button appears in active state (default variant)
 * @param {boolean} props.isPrevNext - If true, uses small size; otherwise uses icon size
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {PaginationButtonProps} props - Additional button props passed to the underlying Button component
 * @returns {JSX.Element} A styled Button component for pagination
 *
 * @example
 * // Active page number button
 * <PaginationButton isActive={true} isPrevNext={false} disabled={false} />
 *
 * @example
 * // Previous/Next navigation button
 * <PaginationButton isActive={false} isPrevNext={true} disabled={false} />
 */
export const PaginationButton = ({
	isActive,
	isPrevNext,
	disabled,
	className = '',
	...props
}: PaginationButtonProps) => {
	const paginationStyles = cn(
		// Кастомные стили для page numbers
		!isPrevNext && 'h-12 w-12  md:h-8 md:w-8 text-center',
		// Цвета для active/inactive
		!isPrevNext && isActive && 'bg-ctp-blue text-ctp-base border-ctp-blue',
		!isPrevNext &&
			!isActive &&
			'bg-ctp-surface0 text-ctp-text border-ctp-surface1 hover:bg-ctp-surface1',
		className,
	);
	return (
		<Button
			variant={isActive ? 'default' : 'outline'}
			size={isPrevNext ? 'sm' : 'icon'}
			disabled={disabled}
			className={paginationStyles}
			{...props}
		/>
	);
};
