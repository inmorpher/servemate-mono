'use client';

import { RefObject, useEffect } from 'react';

interface SwipeHandlers {
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	onSwipeUp?: () => void;
	onSwipeDown?: () => void;
	threshold?: number; // minimal diatnce in pixels to be considered a swipe
}

export const useSwipe = (
	ref: RefObject<HTMLElement | null>,
	{ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50 }: SwipeHandlers,
) => {
	const startX = { current: 0 };
	const startY = { current: 0 };

	useEffect(() => {
		console.log('swipe hook initialized with threshold:', threshold);
		const element = ref.current;

		if (!element) return;

		const handleTouchStart = (event: TouchEvent) => {
			startX.current = event.touches[0].clientX;
			startY.current = event.touches[0].clientY;
		};

		const handleTouchEnd = (event: TouchEvent) => {
			const endX = event.changedTouches[0].clientX;
			const endY = event.changedTouches[0].clientY;

			const diffX = startX.current - endX;
			const diffY = startY.current - endY;
			console.log('Swipe detected:', { diffX, diffY, threshold });
			// Hotizontal swipe
			if (Math.abs(diffX) > threshold && Math.abs(diffY) < threshold) {
				if (diffX > 0) {
					console.log('Swipe LEFT');
					onSwipeLeft?.();
				} else {
					console.log('Swipe RIGHT');
					onSwipeRight?.();
				}
			}

			if (Math.abs(diffY) > threshold && Math.abs(diffX) < threshold) {
				if (diffY > 0) {
					console.log('Swipe UP');
					onSwipeUp?.();
				} else {
					console.log('Swipe DOWN');
					onSwipeDown?.();
				}
			}
		};

		element.addEventListener('touchstart', handleTouchStart);
		element.addEventListener('touchend', handleTouchEnd);

		return () => {
			element.removeEventListener('touchstart', handleTouchStart);
			element.removeEventListener('touchend', handleTouchEnd);
		};
	}, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);
};
