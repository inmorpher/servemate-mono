import { RealtimeEvent } from '@servemate/shared-dto';
import { useEffect, useRef } from 'react';

type UseRealtimeOptions = {
	resource: string;
	entityId?: string | number;
	enabled?: boolean;
	onEvent?: (event: RealtimeEvent) => void;
};

/**
 * useRealtime
 *
 * Subscribes to realtime events for a resource through the Next.js SSE proxy
 * (`/api/service/realtime`). The browser never talks to the API WebSocket directly.
 *
 * @param resource - Realtime resource name, e.g. `orders`.
 * @param entityId - Optional entity id to narrow the subscription.
 * @param enabled - Set to false to skip subscribing.
 * @param onEvent - Called for every event. Kept in a ref so inline callbacks don't reconnect.
 */
export function useRealtime({ resource, entityId, enabled = true, onEvent }: UseRealtimeOptions) {
	const onEventRef = useRef(onEvent);

	useEffect(() => {
		onEventRef.current = onEvent;
	}, [onEvent]);

	useEffect(() => {
		if (!enabled) return;

		const params = new URLSearchParams({ resource });
		if (entityId !== undefined) params.set('entityId', String(entityId));

		const source = new EventSource(`/api/service/realtime?${params.toString()}`);

		source.onmessage = (message: MessageEvent<string>) => {
			const event = JSON.parse(message.data) as RealtimeEvent;
			onEventRef.current?.(event);
		};

		source.addEventListener('error', (message) => {
			if (message instanceof MessageEvent && message.data) {
				console.error('Realtime error:', message.data);
			}
		});

		return () => {
			source.close();
		};
	}, [resource, entityId, enabled]);
}
