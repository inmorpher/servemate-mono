'use client';
import { useSidebarStore } from '@/features/sidebar/model/useSidebarStore';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// SidebarProvider — просто хук для синхронизации pathname с store
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
	const setPathname = useSidebarStore((state) => state.setPathname);
	const pathname = usePathname();

	useEffect(() => {
		setPathname(pathname);
	}, [pathname, setPathname]);

	return <>{children}</>;
};
