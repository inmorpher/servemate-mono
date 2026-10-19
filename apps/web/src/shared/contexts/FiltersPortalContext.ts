'use client';

import { createContext } from 'react';

export const FiltersPortalContext = createContext<{ target: HTMLDivElement | null }>({
	target: null,
});
