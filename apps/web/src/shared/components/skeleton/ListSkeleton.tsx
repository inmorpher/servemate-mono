export const ListSkeleton = ({ count }: { count: number }) => {
	return (
		<div className='space-y-4'>
			{[...Array(count)].map((_, index) => (
				<div
					key={index}
					className='bg-ctp-surface0 border border-ctp-surface1 rounded-lg p-4 animate-pulse'
				>
					<div className='flex items-start justify-between'>
						<div className='flex-grow'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='h-6 bg-ctp-surface1 rounded w-32'></div>
								<div className='h-5 bg-ctp-surface1 rounded w-16'></div>
								<div className='h-5 bg-ctp-surface1 rounded w-20'></div>
							</div>
							<div className='h-4 bg-ctp-surface1 rounded w-48 mb-2'></div>
							<div className='flex gap-4'>
								<div className='h-3 bg-ctp-surface1 rounded w-24'></div>
								<div className='h-3 bg-ctp-surface1 rounded w-24'></div>
								<div className='h-3 bg-ctp-surface1 rounded w-32'></div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
