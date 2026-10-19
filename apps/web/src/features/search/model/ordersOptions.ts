import { Allergies, OrderSortOptions, OrderState } from '@servemate/dto';

/**
 * Provides configuration options for searching orders.
 *
 * @property allergies - An array of allergy options, each with a `label` and `value`, generated from the `Allergy` enum.
 * @property statuses - An array of status options for filtering orders by their state.
 * @property sortOptions - An array of sorting options, each with a `label` and `value`, generated from the `OrderSortColumn` enum.
 */
export const orderSearchOptions = {
	allergies: [
		...Object.entries(Allergies).map(([key, value]) => ({
			label: key,
			value: value,
		})),
	],
	statuses: [
		{ label: 'Awaiting', value: OrderState.AWAITING },
		{ label: 'In Progress', value: OrderState.RECEIVED },
		{ label: 'Ready', value: OrderState.SERVED },
		{ label: 'Payment', value: OrderState.READY_TO_PAY },
		{ label: 'Disputed', value: OrderState.DISPUTED },
		{ label: 'Canceled', value: OrderState.CANCELED },
		{ label: 'Completed', value: OrderState.COMPLETED },
	],
	sortOptions: [
		...Object.entries(OrderSortOptions).map(([key, value]) => ({
			label: key,
			value: value,
		})),
	],
};
