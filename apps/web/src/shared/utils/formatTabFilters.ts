// formatTabFilters.ts
export const formatFilterValue = (key: string, value: unknown): string => {
	// Даты (universal - работает везде)
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
		return new Date(value).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	// Массивы
	if (Array.isArray(value)) return value.join(', ');

	// Числа - по контексту ключа
	if (typeof value === 'number') {
		if (key.includes('Amount') || key.includes('Price')) return `$${value}`;
		if (key.includes('Table')) return `#${value}`;
		return String(value);
	}

	return String(value);
};

export const formatFilterKey = (key: string): string => {
	const labels: Record<string, string> = {
		// Orders
		dateFrom: 'From',
		dateTo: 'To',
		minAmount: 'Min Amount',
		maxAmount: 'Max Amount',
		status: 'Status',
		allergies: 'Allergies',
		tableNumbers: 'Tables',

		// Users
		role: 'Role',
		email: 'Email',
		name: 'Name',
		createdFrom: 'Created From',
		createdTo: 'Created To',

		// Payments
		paymentStatus: 'Payment Status',
		paymentMethod: 'Payment Method',
		minPaymentAmount: 'Min Payment Amount',
		maxPaymentAmount: 'Max Payment Amount',
	};

	return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
};
