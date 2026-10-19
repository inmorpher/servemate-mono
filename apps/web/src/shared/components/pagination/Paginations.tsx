'use client';

import { usePagination } from './hooks/usePagination';
import { PageSizeSelect } from './PageSizeSelect';
import { PaginationButton } from './PaginationButton';
import { PaginationProps } from './types';

const Pagination = ({
	totalCount = 0,
	totalPages = 1,
	currentPage = 1,
	pageSize = 10,
	onPageChange = () => {},
	onPageSizeChange = () => {},
}: PaginationProps) => {
	const { visiblePages } = usePagination({ totalPages, currentPage });

	return (
		<nav className='z-10 px-6 py-4' aria-label='Pages navigation' role='navigation'>
			<div className='flex flex-wrap-reverse items-center justify-center gap-2'>
				<PageSizeSelect value={pageSize} onChange={onPageSizeChange} />

				<div className='flex items-center gap-1'>
					{/* Previous Page Button */}
					<PaginationButton
						disabled={currentPage <= 1}
						aria-label={`Navigate to the previous page (${currentPage - 1})`}
						aria-disabled={currentPage <= 1}
						onClick={() => onPageChange(currentPage - 1)}
					>
						←
					</PaginationButton>
					{/* Page Numbers */}
					{visiblePages.map((page, index) => (
						<PaginationButton
							key={String(page) + '-' + index}
							isActive={page === currentPage}
							disabled={page === '...'}
							aria-label={
								typeof page === 'number'
									? `Page ${page}${page === currentPage ? ' (current)' : ''}`
									: undefined
							}
							aria-current={page === currentPage ? 'page' : undefined}
							aria-disabled={page === '...'}
							onClick={() => typeof page === 'number' && onPageChange(page)}
						>
							{page}
						</PaginationButton>
					))}
					{/* Next Page Button */}
					<PaginationButton
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage >= totalPages}
						aria-label={`Navigate to the next page (${currentPage + 1})`}
					>
						→
					</PaginationButton>
				</div>
			</div>
		</nav>
	);
};

export default Pagination;
