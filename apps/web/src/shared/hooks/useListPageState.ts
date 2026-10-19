import { useTabs } from '../components/tabs/store/useTabs';
import { Tab } from '../components/tabs/types/tabs.type';

type BaseListFilters = {
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	page?: number;
	pageSize?: number;
};

export const useListPageState = <TFilters extends BaseListFilters>({
	tabId,
}: {
	tabId: Tab['id'];
}) => {
	const currentTab: Tab<TFilters> | undefined = useTabs((state) => state.getTabById(tabId));
	const updateTab = useTabs((state) => state.updateTab);

	const filters = currentTab?.filters ?? ({} as TFilters);

	if (!currentTab) {
		console.error(`Tab with id ${tabId} not found`);
		throw new Error(`Tab with id ${tabId} not found`);
	}

	const updateFilters = (patch: Partial<TFilters>) => {
		updateTab(currentTab.id, {
			filters: {
				...filters,
				...patch,
			},
		});
	};

	const handleSortChange = (sortBy: TFilters['sortBy']) => {
		const nextSortOrder =
			filters?.sortBy === sortBy && filters?.sortOrder === 'desc' ? 'asc' : 'desc';

		updateFilters({
			sortBy,
			sortOrder: nextSortOrder,
			page: 1,
		} as Partial<TFilters>);
	};

	const handlePageChange = (newPage: number) => {
		updateFilters({
			page: newPage,
		} as Partial<TFilters>);
	};

	const handlePageSizeChange = (newSize: number) => {
		updateFilters({
			pageSize: newSize,
			page: 1,
		} as Partial<TFilters>);
	};

	return {
		filters,
		handleSortChange,
		handlePageChange,
		handlePageSizeChange,
	};
};
