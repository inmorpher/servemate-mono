export const REALTIME_RESOURCES = [
  'orders',
  'users',
  'tables',
  'payments',
  'reservations',
  'food-items',
  'drink-items',
  'workspace',
] as const;

export type RealtimeResource = (typeof REALTIME_RESOURCES)[number];

// Format: `<resource>:<action>`, e.g. `orders:created`, `tables:updated`.
export type RealtimeEvent = {
  id: string;
  type: string;
  resource: RealtimeResource;
  entityId?: string | number;
  payload?: unknown;
  occurredAt: string;
};

export function isRealtimeResource(value: string): value is RealtimeResource {
  return (REALTIME_RESOURCES as readonly string[]).includes(value);
}
