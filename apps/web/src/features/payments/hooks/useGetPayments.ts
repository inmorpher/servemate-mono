'use client';

import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { paymentsEndpoints } from '../api';
import type { PaymentListResult, PaymentSearchCriteria } from '../types';

export const useGetPayments = (criteria: PaymentSearchCriteria = {}) =>
	useApiQuery<PaymentListResult>(paymentsEndpoints.list, criteria, {
		queryKeyScope: 'payments',
		refetchOnWindowFocus: false,
	});
