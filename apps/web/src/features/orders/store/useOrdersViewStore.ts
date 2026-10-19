'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'list' | 'grid';

interface OrdersViewStore {
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
	toggleViewMode: () => void;
	getOptimalMode: (screenWidth: number) => ViewMode;
}

/**
 * Get optimal view mode based on screen width
 * Large screens (1600px+) default to grid for better space usage
 */
const getOptimalMode = (screenWidth: number): ViewMode => {
	return screenWidth >= 1600 ? 'grid' : 'list';
};

export const useOrdersViewStore = create<OrdersViewStore>()(
	persist(
		(set) => ({
			viewMode: 'list',
			setViewMode: (mode: ViewMode) => set({ viewMode: mode }),
			toggleViewMode: () =>
				set((state) => ({
					viewMode: state.viewMode === 'list' ? 'grid' : 'list',
				})),
			getOptimalMode,
		}),
		{
			name: 'orders-view-mode',
		},
	),
);
