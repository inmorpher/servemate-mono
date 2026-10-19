'use client';

import { useLayoutEffect, useState } from 'react';

/**
 * Hook that tracks media query matches and returns the current match state.
 *
 * @param query - A valid CSS media query string to evaluate
 * @returns A boolean indicating whether the media query currently matches
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * ```
 */
const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState<boolean | null>(null);

	useLayoutEffect(() => {
		const media = window.matchMedia(query);
		setMatches(media.matches);

		const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
		media.addEventListener('change', listener);

		return () => media.removeEventListener('change', listener);
	}, [query]);

	// На сервере или до гидрации вернуть false, потом обновится
	return matches ?? false;
};

export default useMediaQuery;
