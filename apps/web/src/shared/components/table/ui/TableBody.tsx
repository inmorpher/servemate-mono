import { TableBodyProps } from '../types';

export const TableBody = ({ className, ref, ...props }: TableBodyProps) => {
	return <tbody ref={ref} className={className} {...props} />;
};
