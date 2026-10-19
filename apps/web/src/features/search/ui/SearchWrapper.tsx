import { ReactNode } from 'react';

export const SearchWrapper = ({ children }: { children: ReactNode }) => {
	return <div className='flex flex-wrap items-center gap-3'>{children}</div>;
};
