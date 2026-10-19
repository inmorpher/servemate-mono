import { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';

export type TableCellProps = ComponentPropsWithoutRef<'td'> & {
	ref?: Ref<HTMLTableCellElement>;
	isSelected?: boolean;
	truncate?: boolean;
};

export type TableHeaderCellProps = ComponentPropsWithoutRef<'th'> & {
	ref?: Ref<HTMLTableCellElement>;
	isSelected?: boolean;
	alignRight?: boolean;
	isSorted?: 'asc' | 'desc';
	isSortable?: boolean;
};

export type TableRowProps = ComponentPropsWithoutRef<'tr'> & {
	ref?: Ref<HTMLTableRowElement>;
	isSelected?: boolean;
};

export type TableHeadProps = ComponentPropsWithoutRef<'thead'> & {
	ref?: Ref<HTMLTableSectionElement>;
};

export type TableBodyProps = ComponentPropsWithoutRef<'tbody'> & {
	ref?: Ref<HTMLTableSectionElement>;
};

export type TableSkeletonProps = {
	rows?: number;
	columns?: number;
	className?: string;
};

export type TableEmptyStateProps = ComponentPropsWithoutRef<'tr'> & {
	children?: ReactNode;
	colSpan?: number;
};

export type TableProps = ComponentPropsWithoutRef<'table'> & {
	isVertiacal?: boolean;
	ref?: Ref<HTMLTableElement>;
};
