'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrdersFiltersStore {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

/**
 * Manage filters panel visibility on mobile/desktop
 * On mobile starts closed, on desktop always visible (via CSS lg:translate-x-0)
 */
export const useOrdersFiltersStore = create<OrdersFiltersStore>()(
	persist(
		(set) => ({
			isOpen: false, // Mobile: default closed, will be shown on desktop via CSS
			open: () => set({ isOpen: true }),
			close: () => set({ isOpen: false }),
			toggle: () => set((state) => ({ isOpen: !state.isOpen })),
		}),
		{
			name: 'orders-filters-visibility',
		},
	),
);
