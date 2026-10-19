import { UserRole } from '@servemate/dto';

const getRoleColor = (role: UserRole, variant: 'text' | 'bg') => {
	switch (role) {
		case 'ADMIN':
			return variant === 'text' ? 'text-ctp-mauve' : 'bg-ctp-mauve';
		case 'MANAGER':
			return variant === 'text' ? 'text-ctp-peach' : 'bg-ctp-peach';
		case 'HOST':
			return variant === 'text' ? 'text-ctp-mauve' : 'bg-ctp-mauve';
		case 'USER':
			return variant === 'text' ? 'text-ctp-text' : 'bg-ctp-text';
		default:
			return variant === 'text' ? 'text-ctp-text' : 'bg-ctp-surface1';
	}
};

const formatDate = (date: Date | string) => {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export { formatDate, getRoleColor };
