'use client';

import { cn } from '@/shared/utils/classNames';
import { createContext, useCallback, useEffect, useState } from 'react';
import Toast from './Toast';

const TOASTER_TYPE = {
	info: 'info',
	success: 'success',
	error: 'error',
	warn: 'warn',
} as const;

const TOASTER_DURATION = {
	DEFAULT: 3000,
	SHORT: 1000,
	LONG: 5000,
} as const;

interface IToasterContext {
	addToast: (
		message: string,
		type: keyof typeof TOASTER_TYPE,
		duration?: keyof typeof TOASTER_DURATION,
	) => void;
	removeToast: (id: number | string) => void;
}

interface ToastOptions {
	message: string;
	type?: keyof typeof TOASTER_TYPE;
	duration?: keyof typeof TOASTER_DURATION;
}

export interface IToast {
	id: number | string;
	message: string;
	type: 'info' | 'success' | 'error' | 'warn';
	duration: number;
	isClosing: boolean;
}

let toastHandler: ((options: ToastOptions) => void) | null = null;

const ANIMATION_DURATION = 300;

const ToasterContext = createContext<IToasterContext | null>(null);

const Toaster = () => {
	const [toasts, setToasts] = useState<IToast[]>([]);

	const addToast = useCallback((options: ToastOptions) => {
		const { message, type = 'info', duration = 'DEFAULT' } = options;
		const id = 'Toast-' + Date.now();

		setToasts((prevToasts) => [
			...prevToasts,
			{
				id,
				message,
				type: TOASTER_TYPE[type],
				duration: TOASTER_DURATION[duration] + ANIMATION_DURATION * 2,
				isClosing: false,
			},
		]);

		const timer = setTimeout(() => {
			removeToast(id);
		}, TOASTER_DURATION[duration]);

		return () => clearTimeout(timer);
	}, []);

	const removeToast = (id: number | string) => {
		// mark the toast as closing
		setToasts((prevToasts) =>
			prevToasts.map((toast) => (toast.id === id ? { ...toast, isClosing: true } : toast)),
		);

		// Then remove it after the animation duration
		setTimeout(() => {
			setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
		}, ANIMATION_DURATION);
	};

	useEffect(() => {
		toastHandler = addToast;

		return () => {
			toastHandler = null;
		};
	}, [addToast]);

	return (
		<div className={cn('fixed top-0 right-0 bottom-0 z-50 w-1 transition-all duration-50')}>
			{toasts.map((toast, index) => {
				return (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						index={index}
						isClosing={toast.isClosing}
						onClose={() => removeToast(toast.id)}
					/>
				);
			})}
		</div>
	);
};

const useToaster = () => {
	return {
		toast: (options: ToastOptions) => {
			if (!toastHandler) {
				console.error('Toaster is not initialized');
				return;
			}

			toastHandler(options);
		},
	};
};

export { Toaster, useToaster };
export default ToasterContext;
