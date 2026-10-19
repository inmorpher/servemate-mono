'use client';

import { Button } from '../components/button';
import { cn } from '../utils/classNames';

interface ListErrorProps {
	error?: string;
	refetch?: () => void;
	title?: string;
	buttonText?: string;
	isLoading?: boolean;
}

/**
 * ListError
 *
 * Display a centered error state with an icon, title, optional error message,
 * and a retry button. The button invokes the provided `refetch` callback and
 * shows a loading spinner / disabled state when `isLoading` is true.
 *
 * @param props.error - Optional error message to display below the title. If falsy, the message is omitted.
 * @param props.refetch - Callback invoked when the retry button is clicked.
 * @param props.title - Optional heading text for the error state. Default: `'Loading error'`.
 * @param props.buttonText - Optional label for the retry button. Default: `'Try again'`.
 * @param props.isLoading - When true, disables the retry button and shows an inline spinner. Default: `false`.
 *
 * @returns JSX.Element - A section containing an icon, heading, optional message, and retry button.
 *
 * @remarks
 * - The component uses `aria-live="assertive"` to announce changes to assistive technologies.
 * - The retry button receives an `aria-label` that reflects the loading state.
 * - Uses `role="alert"` to conform to ARIA specifications for error announcements.
 *
 * @example
 * <ListError
 *   error="Failed to load items"
 *   refetch={() => fetchItems()}
 *   title="Could not load list"
 *   buttonText="Retry"
 * />
 */
export const ListError = ({
	error,
	refetch = () => {},
	title = 'Loading error',
	buttonText = 'Try again',
	isLoading = false,
}: ListErrorProps) => {
	return (
		<section role='alert' aria-live='assertive' className='flex items-center justify-center'>
			<div className='text-center'>
				<div className='text-ctp-red mb-4 transition-all duration-200 hover:scale-105'>
					<svg
						className='mx-auto h-16 w-16'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						aria-label='Error icon'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
				</div>
				<h2 className='text-ctp-text mb-2 text-xl font-semibold'>{title}</h2>
				{error && <p className='text-ctp-subtext0 mb-4'>{error}</p>}

				<Button
					variant='default'
					onClick={() => !isLoading && refetch()} // Disable button when loading
					disabled={isLoading} // Disable button when loading
					className={cn(
						'text-ctp-base rounded-lg px-4 py-2 transition-all duration-200',
						isLoading
							? 'bg-ctp-surface1 cursor-not-allowed'
							: 'bg-ctp-blue hover:bg-ctp-sapphire focus:ring-ctp-blue hover:scale-105 focus:ring-2',
					)}
					aria-label={isLoading ? 'Retrying...' : 'Retry: Try again'}
				>
					{isLoading ? (
						<span className='flex items-center'>
							<svg
								className='mr-2 h-4 w-4 animate-spin'
								fill='none'
								viewBox='0 0 24 24'
							>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
								></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
								></path>
							</svg>
							Retrying...
						</span>
					) : (
						buttonText
					)}
				</Button>
			</div>
		</section>
	);
};
