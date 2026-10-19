'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DrawerState {
	openDrawers: Record<string, boolean>;
	open: (id: string) => void;
	close: (id: string) => void;
	toggle: (id: string) => void;
	isOpen: (id: string) => boolean;
}

export const useDrawerStore = create<DrawerState>()(
	devtools((set, get) => ({
		openDrawers: {},

		open: (id: string) =>
			set((state) => ({
				openDrawers: { ...state.openDrawers, [id]: true },
			})),

		close: (id: string) =>
			set((state) => ({
				openDrawers: { ...state.openDrawers, [id]: false },
			})),

		toggle: (id: string) =>
			set((state) => ({
				openDrawers: {
					...state.openDrawers,
					[id]: !state.openDrawers[id],
				},
			})),

		isOpen: (id: string) => {
			const state = get();
			return state.openDrawers[id] ?? false;
		},
	})),
);
