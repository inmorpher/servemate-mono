'use client';

import { useTabs, useTabsStoreApi } from '@/shared/components/tabs/store/useTabs';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useEffect, useRef, useState } from 'react';
import type { FoodSearchCriteria } from '../types';

type TextFilterKey = 'name';
type DietaryFilterKey = 'isVegan' | 'isGlutenFree' | 'isVegetarian';

const textFilterKeys: TextFilterKey[] = ['name'];

export const useFoodFilters = (tabId: Tab['id']) => {
	const tabsStore = useTabsStoreApi();
	const currentTab = useTabs((state) => state.getTabById(tabId)) as
		| Tab<FoodSearchCriteria>
		| undefined;
	const filters = currentTab?.filters;
	const [nameValue, setNameValue] = useState(filters?.name ?? '');
	const textFilterTimers = useRef<Partial<Record<TextFilterKey, ReturnType<typeof setTimeout>>>>(
		{},
	);

	const updateFilters = (patch: Partial<FoodSearchCriteria>) => {
		const store = tabsStore.getState();
		const tab = store.getTabById(tabId) as Tab<FoodSearchCriteria> | undefined;
		if (!tab) {
			return;
		}

		store.updateTab(tabId, {
			filters: {
				...(tab.filters ?? {}),
				...patch,
				page: 1,
			},
		});
	};

	const scheduleTextFilter = (key: TextFilterKey, value: string) => {
		const existingTimer = textFilterTimers.current[key];
		if (existingTimer !== undefined) {
			clearTimeout(existingTimer);
		}

		textFilterTimers.current[key] = setTimeout(() => {
			const nextValue = value.trim() || undefined;
			updateFilters({ [key]: nextValue } as Partial<FoodSearchCriteria>);
		}, 300);
	};

	useEffect(() => {
		setNameValue(filters?.name ?? '');
	}, [filters?.name, tabId]);

	useEffect(
		() => () => {
			textFilterKeys.forEach((key) => {
				const timer = textFilterTimers.current[key];
				if (timer !== undefined) {
					clearTimeout(timer);
				}
			});
		},
		[],
	);

	const handleClearFilters = () => {
		textFilterKeys.forEach((key) => {
			const timer = textFilterTimers.current[key];
			if (timer !== undefined) {
				clearTimeout(timer);
				delete textFilterTimers.current[key];
			}
		});
		setNameValue('');
		tabsStore.getState().clearFilters(tabId);
	};

	const handleNameChange = (value: string) => {
		setNameValue(value);
		scheduleTextFilter('name', value);
	};

	const handleCategoryChange = (value: string) => {
		updateFilters({ category: value || undefined });
	};

	const handleTypeChange = (value: string) => {
		updateFilters({ type: value || undefined });
	};

	const handleAvailabilityChange = (value: string) => {
		updateFilters({ isAvailable: value === '' ? undefined : value === 'true' });
	};

	const handlePriceChange = (value: string) => {
		updateFilters({ price: value === '' ? undefined : Number(value) });
	};

	const handleDietaryChange = (key: DietaryFilterKey, checked: boolean) => {
		updateFilters({ [key]: checked ? true : undefined });
	};

	const hasFilters = Boolean(
		nameValue.trim() ||
		filters?.category ||
		filters?.type ||
		filters?.isAvailable !== undefined ||
		filters?.price !== undefined ||
		filters?.isVegan !== undefined ||
		filters?.isGlutenFree !== undefined ||
		filters?.isVegetarian !== undefined,
	);

	return {
		filters,
		nameValue,
		handleNameChange,
		handleCategoryChange,
		handleTypeChange,
		handleAvailabilityChange,
		handlePriceChange,
		handleDietaryChange,
		handleClearFilters,
		hasFilters,
	};
};
