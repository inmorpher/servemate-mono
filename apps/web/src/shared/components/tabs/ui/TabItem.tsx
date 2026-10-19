import { NavButton } from '@/shared/components/nav-button/NavButton';
import { Tab } from '../types/tabs.type';

type TabItemProps = {
	tab: Tab;
	isActive: boolean;
	onSelect: (tabId: string) => void;
	onClose: (tabId: string) => void;
	classNames?: string;
};

export const TabItem = ({ tab, isActive, onSelect, onClose, classNames }: TabItemProps) => {
	return (
		<NavButton
			label={tab.title}
			isActive={isActive}
			onClick={() => onSelect(tab.id)}
			onClose={() => onClose(tab.id)}
			variant='tab'
			classNames={classNames}
		/>
	);
};
