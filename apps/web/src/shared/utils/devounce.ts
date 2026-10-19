export function debounce<T extends (...args: never[]) => void>(
	callback: T,
	delay: number = 300
): (...args: Parameters<T>) => void {
	let timer: NodeJS.Timeout | null = null;
	return (...args: Parameters<T>) => {
		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}
