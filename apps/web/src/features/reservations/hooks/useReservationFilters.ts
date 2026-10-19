'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useEffect, useState } from 'react';
import type { ReservationSearchCriteria } from '../types';

export const useReservationFilters = (tabId: Tab['id']) => {
	const currentTab = useTabs((state) => state.getTabById(tabId)) as
		| Tab<ReservationSearchCriteria>
		| undefined;
	const updateTab = useTabs((state) => state.updateTab);
	const clearFilters = useTabs((state) => state.clearFilters);
	const filters = currentTab?.filters;
	const [nameValue, setNameValue] = useState(filters?.name ?? '');
	const [emailValue, setEmailValue] = useState(filters?.email ?? '');
	const [phoneValue, setPhoneValue] = useState(filters?.phone ?? '');
	const debouncedName = useDebounce(nameValue, 300);
	const debouncedEmail = useDebounce(emailValue, 300);
	const debouncedPhone = useDebounce(phoneValue, 300);

	useEffect(() => setNameValue(filters?.name ?? ''), [filters?.name]);
	useEffect(() => setEmailValue(filters?.email ?? ''), [filters?.email]);
	useEffect(() => setPhoneValue(filters?.phone ?? ''), [filters?.phone]);

	useEffect(() => {
		if (!currentTab) {
			return;
		}

		const name = debouncedName.trim() || undefined;
		const email = debouncedEmail.trim() || undefined;
		const phone = debouncedPhone.trim() || undefined;
		if (
			(filters?.name ?? undefined) === name &&
			(filters?.email ?? undefined) === email &&
			(filters?.phone ?? undefined) === phone
		) {
			return;
		}

		updateTab(currentTab.id, {
			filters: { ...filters, name, email, phone, page: 1 },
		});
	}, [currentTab, debouncedEmail, debouncedName, debouncedPhone, filters, updateTab]);

	const updateFilters = (patch: Partial<ReservationSearchCriteria>) => {
		if (!currentTab) {
			return;
		}

		updateTab(currentTab.id, {
			filters: { ...filters, ...patch, page: 1 },
		});
	};

	const handleTimeRangeChange = (range: { from?: string; to?: string }) => {
		updateFilters({ timeStart: range.from, timeEnd: range.to });
	};

	const handleClearFilters = () => {
		setNameValue('');
		setEmailValue('');
		setPhoneValue('');
		clearFilters(tabId);
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
		phoneValue,
		setNameValue,
		setEmailValue,
		setPhoneValue,
		updateFilters,
		handleTimeRangeChange,
		handleClearFilters,
		hasFilters,
	};
};
