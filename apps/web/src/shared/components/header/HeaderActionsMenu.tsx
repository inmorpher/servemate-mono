'use client';

import { logoutAction } from '@/features/auth/actions/logout';
import { workspaceMutationKey } from '@/features/workspace/api/client';
import { useWorkspaceSyncStore } from '@/features/workspace/store/useWorkspaceSyncStore';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { useIsMutating } from '@tanstack/react-query';
import {
	AlertCircle,
	Bell,
	Cloud,
	LogOut,
	MoreVertical,
	RefreshCw,
	Settings,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NotificationItem {
	id: string;
	message: string;
	timestamp: Date;
	isRead: boolean;
}

interface HeaderActionsMenuProps {
	notificationCount?: number;
	notifications?: NotificationItem[];
}

export const HeaderActionsMenu = ({
	notificationCount = 0,
	notifications = [],
}: HeaderActionsMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const router = useRouter();
	const workspaceSyncStatus = useWorkspaceSyncStore((state) => state.status);
	const lastSyncedAt = useWorkspaceSyncStore((state) => state.lastSyncedAt);
	const setSyncStatus = useWorkspaceSyncStore((state) => state.setStatus);
	const isWorkspaceSyncing = useIsMutating({ mutationKey: workspaceMutationKey }) > 0;
	const hasWorkspaceSyncError = workspaceSyncStatus === 'error';
	const isWorkspacePending = workspaceSyncStatus === 'pending';
	const workspaceSyncLabel = isWorkspaceSyncing
		? 'Workspace syncing'
		: isWorkspacePending
			? 'Workspace changes pending'
			: hasWorkspaceSyncError
				? 'Workspace sync error'
				: workspaceSyncStatus === 'idle'
					? 'Workspace sync not initialized'
					: 'Workspace synchronized';
	const syncRetry = useWorkspaceSyncStore((state) => state.retry);
	const syncTimeLabel = lastSyncedAt
		? `Last synced ${Math.max(0, Math.round(((currentTime || Date.now()) - lastSyncedAt) / 1000))}s ago`
		: undefined;

	useEffect(() => {
		if (!isOpen || !lastSyncedAt) {
			return;
		}

		setCurrentTime(Date.now());
		const intervalId = window.setInterval(() => setCurrentTime(Date.now()), 1000);

		return () => window.clearInterval(intervalId);
	}, [isOpen, lastSyncedAt]);

	const handleLogout = async () => {
		await logoutAction();
		router.push('/login');
		setIsOpen(false);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					className='text-ctp-text hover:bg-ctp-surface1 relative flex items-center justify-center rounded-md p-2 transition-colors'
					aria-label={`Menu. ${workspaceSyncLabel}`}
					title={workspaceSyncLabel}
				>
					<MoreVertical className='h-5 w-5' />
					<span
						className={`absolute right-1 bottom-1 h-2 w-2 rounded-full ${
							isWorkspaceSyncing
								? 'bg-ctp-yellow animate-pulse'
								: hasWorkspaceSyncError
									? 'bg-ctp-red'
									: isWorkspacePending
										? 'bg-ctp-yellow'
										: workspaceSyncStatus === 'idle'
											? 'bg-ctp-overlay0'
											: 'bg-ctp-green'
						}`}
						aria-hidden='true'
					/>
					{notificationCount > 0 && (
						<span className='bg-ctp-red text-ctp-crust absolute top-1 right-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold'>
							{notificationCount > 9 ? '9+' : notificationCount}
						</span>
					)}
				</button>
			</PopoverTrigger>

			<PopoverContent
				className='border-ctp-surface1 bg-ctp-base w-48 rounded-lg border p-2 shadow-lg'
				side='bottom'
				align='end'
				sideOffset={15}
			>
				<div className='flex flex-col gap-2'>
					<div className='text-ctp-subtext1 flex items-center gap-3 px-3 py-2 text-sm'>
						{isWorkspaceSyncing ? (
							<RefreshCw className='text-ctp-yellow h-4 w-4 animate-spin' />
						) : hasWorkspaceSyncError ? (
							<AlertCircle className='text-ctp-red h-4 w-4' />
						) : (
							<Cloud className='text-ctp-green h-4 w-4' />
						)}
						<span>
							{isWorkspaceSyncing
								? 'Workspace syncing...'
								: isWorkspacePending
									? 'Workspace changes pending...'
									: hasWorkspaceSyncError
										? 'Workspace sync error'
										: workspaceSyncStatus === 'idle'
											? 'Workspace sync not initialized'
											: 'Workspace synchronized'}
						</span>
					</div>
					{syncTimeLabel && workspaceSyncStatus === 'synced' && (
						<div className='text-ctp-overlay0 px-3 text-xs'>{syncTimeLabel}</div>
					)}
					{hasWorkspaceSyncError && syncRetry && (
						<button
							type='button'
							onClick={() => {
								setSyncStatus('pending');
								void syncRetry();
							}}
							className='text-ctp-blue hover:bg-ctp-surface1 rounded-md px-3 py-2 text-left text-sm'
						>
							Retry synchronization
						</button>
					)}
					<div className='bg-ctp-surface1 h-px' />

					{/* Notifications Section */}
					{notificationCount > 0 && (
						<>
							<button className='hover:bg-ctp-surface1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors'>
								<Bell className='text-ctp-yellow h-4 w-4 shrink' />
								<div className='min-w-0 flex-1'>
									<p className='text-ctp-text truncate font-medium'>
										Notifications
									</p>
									<p className='text-ctp-subtext1 text-xs'>
										{notificationCount} new
									</p>
								</div>
							</button>
							<div className='bg-ctp-surface1 h-px' />
						</>
					)}

					{/* Account */}
					<Link
						href='/account'
						className='hover:bg-ctp-surface1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors'
					>
						<User className='text-ctp-blue h-4 w-4 shrink' />
						<span className='text-ctp-text'>Account</span>
					</Link>

					{/* Settings */}
					<Link
						href='/settings'
						className='hover:bg-ctp-surface1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors'
					>
						<Settings className='text-ctp-green h-4 w-4 shrink' />
						<span className='text-ctp-text'>Settings</span>
					</Link>

					{/* Logout */}
					<div className='bg-ctp-surface1 h-px' />
					<button
						onClick={handleLogout}
						className='hover:bg-ctp-surface2 text-ctp-red flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors'
					>
						<LogOut className='h-4 w-4 shrink' />
						<span>Logout</span>
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
