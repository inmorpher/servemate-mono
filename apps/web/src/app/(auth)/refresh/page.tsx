'use client';

import { refreshSessionAction } from '@/features/auth/api/refresh-sestion';
import { getSafeInternalPath } from '@/shared/utils/safeInternalPath';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const returnUrl = getSafeInternalPath(searchParams.get('returnUrl'), '/dashboard');
	const [retryCount, setRetryCount] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(true);
	const [isTemporarilyUnavailable, setIsTemporarilyUnavailable] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const refresh = async () => {
			try {
				const result = await refreshSessionAction();

				if (cancelled) return;

				if (result.success) {
					router.replace(returnUrl);
					return;
				}

				if (result.retryable) {
					setIsRefreshing(false);
					setIsTemporarilyUnavailable(true);
				} else {
					router.replace(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
				}
			} catch {
				if (!cancelled) {
					setIsRefreshing(false);
					setIsTemporarilyUnavailable(true);
				}
			}
		};

		void refresh();
		return () => {
			cancelled = true;
		};
	}, [retryCount, router, returnUrl]);

	if (!isTemporarilyUnavailable) {
		return <p aria-live='polite'>Обновление сессии...</p>;
	}

	return (
		<div className='flex min-h-48 flex-col items-center justify-center gap-4 p-6 text-center'>
			<p role='alert'>
				Не удалось обновить сессию. Проверьте соединение и повторите попытку.
			</p>
			<button
				type='button'
				disabled={isRefreshing}
				onClick={() => {
					setIsTemporarilyUnavailable(false);
					setIsRefreshing(true);
					setRetryCount((count) => count + 1);
				}}
			>
				{isRefreshing ? 'Повторная попытка...' : 'Повторить'}
			</button>
		</div>
	);
}
