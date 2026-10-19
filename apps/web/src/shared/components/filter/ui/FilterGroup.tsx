import { cn } from '@/shared/utils/classNames';
import { ReactNode } from 'react';

interface FilterGroupProps {
	label: string;
	children: ReactNode;
	className?: string;
	required?: boolean;
	description?: string;
	/** Renders without the card frame. Use when the child already draws its own card (e.g. the calendar). */
	plain?: boolean;
}

/**
 * Renders a group of filter controls as a card with a header (label and optional description).
 *
 * @param props - The props for the FilterGroup component.
 * @param props.label - The label displayed in the card header.
 * @param props.children - The filter controls or elements to be grouped.
 * @param props.className - Optional additional class names for the container.
 * @param props.required - Whether the filter group is required. Displays an asterisk if true.
 * @param props.description - Optional description text displayed below the label.
 * @param props.plain - When true, drops the card frame and keeps only the label above the content.
 *
 * @returns A styled container grouping filter controls with label and description.
 */
export const FilterGroup = ({
	label,
	children,
	className,
	required = false,
	description,
	plain = false,
}: FilterGroupProps) => {
	const header = (
		<div
			className={cn(
				'space-y-1',
				!plain && 'border-ctp-surface1 bg-ctp-surface0/60 border-b px-3 py-2',
			)}
		>
			<label className='text-ctp-subtext1 block text-sm font-medium'>
				{label}
				{required && <span className='text-ctp-red'>*</span>}
			</label>
			{description && <p className='text-ctp-subtext2 text-xs'>{description}</p>}
		</div>
	);

	if (plain) {
		return (
			<div className={cn('w-full space-y-2', className)}>
				{header}
				<div className='flex flex-wrap gap-2'>{children}</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				'border-ctp-surface1 bg-ctp-mantle w-full overflow-hidden rounded-lg border shadow-xl',
				className,
			)}
		>
			{header}
			<div className='flex flex-wrap gap-2 p-3'>{children}</div>
		</div>
	);
};
