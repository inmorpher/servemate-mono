const INTERNAL_ORIGIN = 'https://servemate.invalid';

export function getSafeInternalPath(
	value: string | null | undefined,
	fallback = '/cpanel',
): string {
	if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
		return fallback;
	}

	try {
		const url = new URL(value, INTERNAL_ORIGIN);
		if (url.origin !== INTERNAL_ORIGIN) return fallback;
		return `${url.pathname}${url.search}${url.hash}`;
	} catch {
		return fallback;
	}
}
