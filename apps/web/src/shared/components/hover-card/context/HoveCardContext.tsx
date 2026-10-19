'use client';

import { createContext, useContext } from 'react';
import { HoverCardContextValue } from '../types';

export const HoverCardContext = createContext<HoverCardContextValue | null>(null);

export const useHoverCardContext = (): HoverCardContextValue => {
	const context = useContext(HoverCardContext);

	if (!context) {
		throw new Error('useHoverCardContext must be used within a HoverCard');
	}
	return context;
};
