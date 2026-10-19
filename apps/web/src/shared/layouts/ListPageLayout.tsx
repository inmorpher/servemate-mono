'use client';

import { FiltersPortalContext } from '@/shared/contexts/FiltersPortalContext';
import { LayoutGrid, List, X } from 'lucide-react';
import { ReactNode, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../components/button';
import { Drawer } from '../components/drawer';
import useMediaQuery from '../hooks/useMediaQuery';

type ViewMode = 'list' | 'card';

interface ActiveFilterItem {
	id: string;
	label: ReactNode;
	onRemove?: () => void;
}

interface ListPageLayoutProps {
	filters?: ReactNode;
	content: ReactNode;
	footer?: ReactNode;
	title?: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	activeFilters?: ActiveFilterItem[];
	onClearFilters?: () => void;
	toolbarActions?: ReactNode;
	showViewToggle?: boolean;
	viewMode?: ViewMode;
	onViewModeChange?: (mode: ViewMode) => void;
}

export function ListPageLayout({
	filters,
	content,
	footer,
	title,
	description,
	actions,
	activeFilters,
	onClearFilters,
	toolbarActions,
	showViewToggle = false,
	viewMode,
	onViewModeChange,
}: ListPageLayoutProps) {
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [currentViewMode, setCurrentViewMode] = useState<ViewMode>('list');
	const isMobile = useMediaQuery('(max-width: 1024px)');
	const { target } = useContext(FiltersPortalContext);

	const toggleFilters = () => setFiltersOpen((prev) => !prev);
	const resolvedViewMode = viewMode ?? currentViewMode;

	const handleViewModeChange = (mode: ViewMode) => {
		setCurrentViewMode(mode);
		onViewModeChange?.(mode);
	};

	const hasHeaderContent = Boolean(title || description || actions);
	const hasActiveFilters = Boolean(activeFilters?.length || onClearFilters);
	const hasToolbarContent = Boolean(toolbarActions || showViewToggle);
	const showMobileFiltersToggle = isMobile && Boolean(filters);

	const filtersPanel =
		!isMobile && filters && target
			? createPortal(
					<aside
						aria-label='Filters'
						className='border-ctp-surface1 bg-ctp-surface0/80 sticky top-14 hidden h-[calc(100vh-3.5625rem)] w-80 shrink-0 scrollbar-thin self-start overflow-y-scroll p-4 shadow-sm lg:block'
					>
						<div className='space-y-4'>{filters}</div>
					</aside>,
					target,
				)
			: null;

	return (
		<>
			<div className='flex min-h-0 flex-1 overflow-hidden'>
				<main className='flex min-h-[calc(100vh-3.5625rem)] flex-1 flex-col overflow-hidden'>
					<section className='min-h-0 flex-1 overflow-y-auto'>
						<div className='space-y-4 p-2 md:px-6 md:py-4'>
							{showMobileFiltersToggle ? (
								<div className='flex justify-end'>
									{isMobile && filters ? (
										<Drawer
											id='filters-drawer'
											isOpen={filtersOpen}
											onOpenChange={toggleFilters}
											direction='right'
											size='auto'
											className='bg-ctp-surface0 overflow-y-auto px-4 pt-20 pb-20'
										>
											{filters}
										</Drawer>
									) : null}
								</div>
							) : null}

							{hasHeaderContent || hasActiveFilters || hasToolbarContent ? (
								<div className='space-y-4'>
									{hasHeaderContent ? (
										<div className='border-ctp-surface1/70 flex flex-col gap-4 border-b pb-4 md:flex-row md:items-start md:justify-between'>
											<div className='space-y-1'>
												{title ? (
													<h1 className='text-ctp-text text-xl font-semibold'>
														{title}
													</h1>
												) : null}
												{description ? (
													<p className='text-ctp-text/70 text-sm'>
														{description}
													</p>
												) : null}
											</div>

											{actions ? (
												<div className='flex flex-wrap items-center gap-2'>
													{actions}
												</div>
											) : null}
										</div>
									) : null}

									{hasActiveFilters ? (
										<div className='flex flex-wrap items-center gap-2'>
											{activeFilters?.map((filter) => (
												<div
													key={filter.id}
													className='border-ctp-surface1 bg-ctp-surface0 text-ctp-text flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm shadow-sm'
												>
													<span>{filter.label}</span>
													{filter.onRemove ? (
														<Button
															variant='ghost'
															size='xs'
															className='h-6 w-6 rounded-full p-0'
															onClick={filter.onRemove}
															aria-label='Remove filter'
														>
															<X className='h-3.5 w-3.5' />
														</Button>
													) : null}
												</div>
											))}

											{onClearFilters && activeFilters?.length ? (
												<Button
													variant='chip'
													size='xs'
													onClick={onClearFilters}
												>
													Clear all
												</Button>
											) : null}
										</div>
									) : null}

									{hasToolbarContent ? (
										<div className='border-ctp-surface1 bg-ctp-surface0/70 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3'>
											<div className='flex flex-wrap items-center gap-2'>
												{toolbarActions}
											</div>
											{showViewToggle ? (
												<div className='flex flex-col items-end gap-1'>
													<div className='border-ctp-surface1 bg-ctp-surface0 flex items-center gap-1 rounded-md border p-1'>
														<Button
															variant={
																resolvedViewMode === 'list'
																	? 'default'
																	: 'ghost'
															}
															size='xs'
															className='h-8 w-8 p-0'
															onClick={() =>
																handleViewModeChange('list')
															}
															aria-label='List view'
														>
															<List className='h-4 w-4' />
														</Button>
														<Button
															variant={
																resolvedViewMode === 'card'
																	? 'default'
																	: 'ghost'
															}
															size='xs'
															className='h-8 w-8 p-0'
															onClick={() =>
																handleViewModeChange('card')
															}
															aria-label='Card view'
														>
															<LayoutGrid className='h-4 w-4' />
														</Button>
													</div>
													{resolvedViewMode === 'card' ? (
														<p className='text-ctp-text/60 text-xs'>
															Карточки в работе
														</p>
													) : null}
												</div>
											) : null}
										</div>
									) : null}
								</div>
							) : null}

							<div>{content}</div>
						</div>
					</section>

					{footer ? <footer className='shrink-0 md:px-6 md:py-4'>{footer}</footer> : null}
				</main>

				{filtersPanel}
			</div>
		</>
	);
}
