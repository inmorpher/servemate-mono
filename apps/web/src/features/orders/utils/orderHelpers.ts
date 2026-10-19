import { OrderSearchListResult } from '@servemate/dto';

type OrderStatus = OrderSearchListResult['orders'][number]['status'];

const getStatusColor = (status: OrderStatus) => {
	switch (status) {
		case 'AWAITING':
			return 'bg-ctp-yellow bg-opacity-20 text-ctp-yellow';
		case 'RECEIVED':
			return 'bg-ctp-blue bg-opacity-20 text-ctp-blue';
		case 'SERVED':
			return 'bg-ctp-green bg-opacity-20 text-ctp-green';
		case 'COMPLETED':
			return 'bg-ctp-teal bg-opacity-20 text-ctp-teal';
		case 'CANCELED':
			return 'bg-ctp-red bg-opacity-20 text-ctp-red';
		case 'DISPUTED':
			return 'bg-ctp-maroon bg-opacity-20 text-ctp-maroon';
		case 'READY_TO_PAY':
			return 'bg-ctp-peach bg-opacity-20 text-ctp-peach';
		default:
			return 'bg-ctp-surface1 bg-opacity-20 text-ctp-text';
	}
};

const getStatusIndicatorColor = (status: OrderStatus) => {
	switch (status) {
		case 'AWAITING':
			return 'bg-ctp-yellow';
		case 'RECEIVED':
			return 'bg-ctp-blue';
		case 'SERVED':
			return 'bg-ctp-green';
		case 'COMPLETED':
			return 'bg-ctp-teal';
		case 'CANCELED':
			return 'bg-ctp-red';
		case 'DISPUTED':
			return 'bg-ctp-maroon';
		case 'READY_TO_PAY':
			return 'bg-ctp-peach';
		default:
			return 'bg-ctp-surface1';
	}
};

const formatDate = (date: Date | string) => {
	return new Date(date).toLocaleDateString('en-US', {
		year: '2-digit',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'decimal',
		currency: 'USD',
	}).format(amount);
};

export { formatCurrency, formatDate, getStatusColor, getStatusIndicatorColor };
