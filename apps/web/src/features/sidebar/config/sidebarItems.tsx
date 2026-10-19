import type { TabEntities } from '@/shared/components/tabs/types/tabs.type';
import {
	BarChart3,
	CalendarDays,
	CreditCard,
	ShoppingCart,
	TableProperties,
	Users,
	Utensils,
	Wine,
	type LucideIcon,
} from 'lucide-react';

export interface SidebarNavigationItem {
	id: string;
	label: string;
	entity: TabEntities;
	icon: LucideIcon;
	href: string;
	openInTab: boolean;
	color: string;
}

export const sidebarItems: SidebarNavigationItem[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		entity: 'dashboard',
		icon: BarChart3,
		href: '/dashboard',
		openInTab: false,
		color: 'bg-ctp-blue',
	},
	{
		id: 'orders',
		label: 'Orders',
		entity: 'orders',
		icon: ShoppingCart,
		href: '/cpanel',
		openInTab: true,
		color: 'bg-ctp-mauve',
	},
	{
		id: 'users',
		label: 'Users',
		entity: 'users',
		icon: Users,
		href: '/cpanel',
		openInTab: true,
		color: 'bg-ctp-green',
	},
	{
		id: 'reservations',
		label: 'Reservations',
		entity: 'reservations',
		icon: CalendarDays,
		href: '/cpanel',
		openInTab: true,
		color: 'bg-ctp-yellow',
	},
	{
		id: 'payments',
		label: 'Payments',
		entity: 'payments',
		icon: CreditCard,
		href: '/cpanel',
		openInTab: true,
		color: 'bg-ctp-green',
	},
	{
		id: 'drinks',
		label: 'Drinks',
		entity: 'drinks',
		icon: Wine,
		href: '/cpanel',
		openInTab: true,
		color: 'bg-ctp-pink',
	},
	{
		id: 'food',
		label: 'Food',
		entity: 'food',
		icon: Utensils,
		href: '/cpanel',
		openInTab: true,
		color: 'bg-ctp-peach',
	},
	{
		id: 'tables',
		label: 'Tables',
		entity: 'tables',
		icon: TableProperties,
		href: '/cpanel',
		openInTab: true,
		color: 'bg-ctp-teal',
	},
];
