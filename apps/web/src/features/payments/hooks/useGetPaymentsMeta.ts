'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { paymentsEndpoints } from '../api';
import type { PaymentsMeta } from '../types';

export const useGetPaymentsMeta = () =>
	useApiQuery<PaymentsMeta>(paymentsEndpoints.meta, undefined, {
		queryKeyScope: 'payments-meta',
		refetchOnWindowFocus: false,
	});
