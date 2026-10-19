'use client';

import { create } from 'zustand';

export interface SidebarState {
	isOpen: boolean;
	pathname: string;
	setIsOpen: (isOpen: boolean) => void;
	toggleSidebar: () => void;
	setPathname: (pathname: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
	isOpen: false,
	pathname: '/',
	setIsOpen: (isOpen: boolean) =>
		set(() => {
			if (typeof window !== 'undefined' && window.innerWidth < 1024) {
				return { isOpen };
			}
			return { isOpen };
		}),
	toggleSidebar: () =>
		set((state) => {
			if (typeof window !== 'undefined' && window.innerWidth < 1024) {
				return { isOpen: !state.isOpen };
			}
			return {};
		}),
	setPathname: (pathname: string) => {
		set((state) => {
			if (typeof window !== 'undefined' && window.innerWidth < 1024) {
				return { pathname, isOpen: false };
			}
			return { pathname };
		});
	},
}));
