import { ReactNode } from 'react';

interface SliderInputControlsProps {
	onDecrement: () => void;
	onIncrement: () => void;
	children: ReactNode;
}

/**
 * Renders a set of increment and decrement controls for a slider input.
 *
 * @param props - The props for the SliderInputControls component.
 * @param props.onDecrement - Callback function to be called when the decrement button is clicked.
 * @param props.onIncrement - Callback function to be called when the increment button is clicked.
 * @param props.children - The content to be displayed between the decrement and increment buttons, typically the current value.
 *
 * @example
 * ```tsx
 * <SliderInputControls
 *   onDecrement={() => setValue(value - 1)}
 *   onIncrement={() => setValue(value + 1)}
 * >
 *   <span>{value}</span>
 * </SliderInputControls>
 * ```
 */
export const SliderInputControls = ({
	onDecrement,
	onIncrement,
	children,
}: SliderInputControlsProps) => {
	return (
		<div className='flex items-center'>
			<button
				onClick={() => onDecrement()}
				className='px-2 py-1 bg-ctp-surface1 text-white rounded-l-md hover:bg-ctp-surface2 active:bg-ctp-blue focus:outline-none'
			>
				-
			</button>
			{children}
			<button
				onClick={() => onIncrement()}
				className='px-2 py-1 bg-ctp-surface1 text-white rounded-r-md hover:bg-ctp-surface2 active:bg-ctp-blue focus:outline-none'
			>
				+
			</button>
		</div>
	);
};
