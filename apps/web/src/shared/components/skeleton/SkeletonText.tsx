import { FC, ReactNode } from 'react';

interface SkeletonProps {
	isLoading: boolean;
	children: ReactNode;
	width?: string;
	height?: string;
	className?: string;
}

const SkeletonText: FC<SkeletonProps> = ({
	isLoading,
	children,
	width = 'w-full',
	height = 'h-6',
	className = '',
}) => {
	if (isLoading) {
		console.log('SkeletonText', { width, height, className });
		return (
			<div
				className={`${width} ${height} bg-ctp-surface2 rounded animate-pulse ${className}`}
			></div>
		);
	}

	return children;
};

export default SkeletonText;
