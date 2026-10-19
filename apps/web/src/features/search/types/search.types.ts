export interface SearchQuery {
	query?: string;
	category?: string;
	page?: number;
}

export interface SearchResult<T> {
	items: T[];
	total: number;
}
