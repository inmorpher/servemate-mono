export const buildQueryParams = <T extends Record<string, unknown>>(criteria: T): string => {
	const params = new URLSearchParams();

	Object.entries(criteria).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			params.append(key, value.toString());
		}
	});

	return params.toString();
};
