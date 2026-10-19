export interface PaginationProps {
	totalCount: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
}
