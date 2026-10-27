import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface FilterWrapper {
	children: ReactNode;
	title?: string;
	classNames?: string;
}

export const FilterWrapper = ({ children, title, classNames }: FilterWrapper) => {
	const header = (
		<div className='bg-ctp-blue corner-squircle absolute top-0 left-0 -translate-x-1/4 -translate-y-3/5 rounded-2xl px-2 py-1'>
			<label>{title}</label>
		</div>
	);
	return (
		<div className={cn('bg-ctp-base corner-squircle relative rounded-2xl p-4', classNames)}>
			{title && header}
			{children}
		</div>
	);
};
