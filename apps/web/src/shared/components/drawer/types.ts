export type DrawerDirection = 'top' | 'right' | 'bottom' | 'left';
export type DrawerSize = 'small' | 'medium' | 'large' | 'auto';
/**
 * Props for a Drawer component that control its visibility, animation direction, and content.
 *
 * @property isOpen - Whether the drawer is currently open.
 * @property onOpenChange - Callback invoked when the open state changes; receives the new open boolean.
 * @property direction - Optional side/direction from which the drawer appears (e.g. left, right, top, bottom).
 * @property children - React nodes rendered inside the drawer.
 */
export interface DrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	direction?: DrawerDirection;
	children: React.ReactNode;
	size?: DrawerSize;
	id?: string;
	className?: string;
}

/**
 * Props for the DrawerContent component.
 *
 * @property {React.ReactNode} children - The content to be rendered inside the drawer.
 * @property {DrawerDirection} direction - The direction from which the drawer appears (e.g., 'left', 'right', etc.).
 * @property {DrawerSize} size - The size of the drawer ('small', 'medium', 'large', 'auto'). Defaults to 'medium'.
 * @property {(open: boolean) => void} onOpenChange - Callback invoked when the open state of the drawer changes.
 */
export interface DrawerContentProps {
	children: React.ReactNode;
	direction: DrawerDirection;
	size?: DrawerSize;
	isOpen: boolean;
	id?: string;
	onOpenChange?: (open: boolean) => void;
	className?: string;
}

/**
 * Props for the DrawerOverlay component.
 *
 * @property onOpenChange - Callback function that is called when the open state of the drawer changes.
 * Receives a boolean indicating whether the drawer is open (`true`) or closed (`false`).
 */
export interface DrawerOverlayProps {
	id: string;
}
