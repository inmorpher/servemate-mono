import { TableRoot } from './ui/Table';
import { TableBody } from './ui/TableBody';
import { TableCell } from './ui/TableCell';
import { TableEmptyState } from './ui/TableEmptyState';
import { TableHead } from './ui/TableHead';
import { TableHeaderCell } from './ui/TableHeaderCell';
import { TableRow } from './ui/TableRow';
import { TableSkeleton } from './ui/TableSkeleton';

export const Table = Object.assign(TableRoot, {
	Head: TableHead,
	Body: TableBody,
	Row: TableRow,
	Cell: TableCell,
	HeaderCell: TableHeaderCell,
	EmptyState: TableEmptyState,
	Skeleton: TableSkeleton,
});
