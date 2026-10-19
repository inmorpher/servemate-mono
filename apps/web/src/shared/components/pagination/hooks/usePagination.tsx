'use client';

import useMediaQuery from '../../../hooks/useMediaQuery';

interface UsePaginationParams {
	totalPages: number;
	currentPage: number;
}

/**
 * Hook for managing pagination logic with responsive page visibility.
 *
 * Calculates which page numbers should be displayed based on the current page
 * and total pages, with different behaviors for mobile and desktop viewports.
 *
 * @param {UsePaginationParams} params - The pagination parameters
 * @param {number} params.totalPages - The total number of pages available
 * @param {number} params.currentPage - The currently active page number
 *
 * @returns {Object} The pagination state and calculated values
 * @returns {boolean} returns.isMobile - Whether the viewport is mobile sized (max-width: 450px)
 * @returns {(number | string)[]} returns.visiblePages - Array of page numbers and ellipsis strings ('...') to display
 *
 * @remarks
 * - On mobile: Shows a maximum of 3 page numbers
 * - On desktop: Shows up to 7 page numbers with ellipsis for large page counts
 * - Always includes first and last pages when total pages > threshold
 * - Uses a sliding window approach when in the middle of pagination
 */
export const usePagination = ({ totalPages, currentPage }: UsePaginationParams) => {
	const isMobile = useMediaQuery('(max-width: 450px)'); // md breakpoint

	const getVisiblePages = () => {
		if (totalPages <= 1) {
			return [];
		}

		if (isMobile) {
			const pages: number[] = [];
			const maxVisible = Math.min(3, totalPages);

			let start = currentPage - Math.floor(maxVisible / 2);
			let end = start + maxVisible - 1;

			if (start < 1) {
				start = 1;
				end = Math.min(totalPages, maxVisible);
			}

			// Корректировка если выходим за правую границу
			if (end > totalPages) {
				end = totalPages;
				start = Math.max(1, end - maxVisible + 1);
			}

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
			return pages;
		}

		const pages: (number | string)[] = [];

		if (currentPage <= 4) {
			// Show first 4 pages: 1, 2, 3, 4, ..., last
			for (let i = 1; i <= Math.min(5, totalPages); i++) {
				pages.push(i);
			}
			// Add dots and last page if needed
			if (totalPages > 4) {
				pages.push('...');
				pages.push(totalPages);
			}
		} else if (currentPage >= totalPages - 3) {
			pages.push(1);
			if (totalPages > 7) {
				pages.push('...');
			}
			// Show at least the last 5 pages
			for (let i = Math.max(2, totalPages - 4); i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Middle: sliding window (current-1, current, current+1)
			pages.push(1);
			pages.push('...');

			const start = currentPage - 1;
			const end = currentPage + 1;

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			pages.push('...');
			pages.push(totalPages);
		}

		return pages;
	};

	return {
		isMobile,
		visiblePages: getVisiblePages(),
	};
};
