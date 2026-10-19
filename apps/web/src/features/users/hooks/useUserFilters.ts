'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { UserSearchCriteria } from '@servemate/dto';
import { useEffect, useState } from 'react';

export type UseUserFiltersReturn = {
	filters: Partial<UserSearchCriteria> | undefined;
	nameValue: string;
	emailValue: string;
	setNameValue: (value: string) => void;
	setEmailValue: (value: string) => void;
	handleRoleToggle: (role: UserSearchCriteria['role']) => void;
	handleStatusToggle: (status: boolean) => void;
	handleCreatedAfterChange: (date: Date | undefined) => void;
	handleCreatedBeforeChange: (date: Date | undefined) => void;
	handleClearFilters: () => void;
	hasFilters: boolean;
};

export const useUserFilters = (): UseUserFiltersReturn => {
	const currentTab: Tab<UserSearchCriteria> | undefined = useTabs((state) =>
		state.getTabById(state.activeTabId),
	);
	const updateTab = useTabs((state) => state.updateTab);
	const clearFilters = useTabs((state) => state.clearFilters);
	const filters = currentTab?.filters;
	const [nameValue, setNameValue] = useState(filters?.name ?? '');
	const [emailValue, setEmailValue] = useState(filters?.email ?? '');
	const debouncedName = useDebounce(nameValue, 300);
	const debouncedEmail = useDebounce(emailValue, 300);

	useEffect(() => {
		setNameValue(filters?.name ?? '');
	}, [filters?.name]);

	useEffect(() => {
		setEmailValue(filters?.email ?? '');
	}, [filters?.email]);

	useEffect(() => {
		const normalizedName = debouncedName.trim();
		if ((filters?.name ?? '') === normalizedName || !currentTab) {
			return;
		}

		updateTab(currentTab.id, {
			filters: {
				...(filters || {}),
				name: normalizedName || undefined,
				page: 1,
			},
		});
	}, [currentTab, debouncedName, filters, updateTab]);

	useEffect(() => {
		const normalizedEmail = debouncedEmail.trim();
		if ((filters?.email ?? '') === normalizedEmail || !currentTab) {
			return;
		}

		updateTab(currentTab.id, {
			filters: {
				...(filters || {}),
				email: normalizedEmail || undefined,
				page: 1,
			},
		});
	}, [currentTab, debouncedEmail, filters, updateTab]);

	const handleRoleToggle = (role: UserSearchCriteria['role']) => {
		if (!currentTab) {
			return;
		}

		updateTab(currentTab.id, {
			filters: {
				...(filters || {}),
				role: filters?.role === role ? undefined : role,
				page: 1,
			},
		});
	};

	const handleStatusToggle = (status: boolean) => {
		if (!currentTab) {
			return;
		}

		updateTab(currentTab.id, {
			filters: {
				...(filters || {}),
				isActive: filters?.isActive === status ? undefined : status,
				page: 1,
			},
		});
	};

	const handleCreatedAfterChange = (date: Date | undefined) => {
		if (!currentTab) {
			return;
		}

		updateTab(currentTab.id, {
			filters: {
				...(filters || {}),
				createdAfter: date ? date.toISOString() : undefined,
				page: 1,
			},
		});
	};

	const handleCreatedBeforeChange = (date: Date | undefined) => {
		if (!currentTab) {
			return;
		}

		updateTab(currentTab.id, {
			filters: {
				...(filters || {}),
				createdBefore: date ? date.toISOString() : undefined,
				page: 1,
			},
		});
	};

	const handleClearFilters = () => {
		if (!currentTab) {
			return;
		}

		setNameValue('');
		setEmailValue('');
		clearFilters(currentTab.id);
	};

	const hasFilters = Boolean(
		filters &&
		Object.values(filters).some(
			(value) =>
				value !== undefined &&
				value !== null &&
				value !== '' &&
				(Array.isArray(value) ? value.length > 0 : true),
		),
	);

	return {
		filters,
		nameValue,
		emailValue,
		setNameValue,
		setEmailValue,
		handleRoleToggle,
		handleStatusToggle,
		handleCreatedAfterChange,
		handleCreatedBeforeChange,
		handleClearFilters,
		hasFilters,
	};
};