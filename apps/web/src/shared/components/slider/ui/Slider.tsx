'use client';
import { cn } from '@/shared/utils/classNames';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface RangeSliderProps {
	minValue: number;
	maxValue: number;
	step?: number;
	value: number[];
	onChange: (values: number[]) => void;
	inputs?: boolean;
}

const RangeSlider = ({
	minValue,
	maxValue,
	step = 1,
	value,
	onChange,
	inputs = true,
}: RangeSliderProps) => {
	const handleSliderChange = (val: number | number[]) => {
		// rc-slider иногда передаёт number, приводим к number[]
		const values = Array.isArray(val) ? val : [val];
		onChange(values);
	};

	const handleInputChange = (index: 0 | 1, newValue: number) => {
		const newValues = [...value];
		newValues[index] = newValue;
		onChange(newValues);
	};

	return (
		<>
			<Slider
				range
				value={value}
				onChange={handleSliderChange} // ← Типа совместимы
				min={minValue}
				max={maxValue}
				step={step}
				styles={{
					rail: { backgroundColor: 'var(--ctp-surface1)' },
					track: { backgroundColor: 'var(--ctp-blue)' },
					handle: {
						backgroundColor: 'var(--ctp-blue)',
						borderColor: 'var(--ctp-blue)',
						opacity: 1,
					},
				}}
			/>
			{inputs && (
				<div className={cn('mt-2 flex w-full items-center justify-between')}>
					<input
						type='number'
						value={value[0]}
						onChange={(e) => handleInputChange(0, Number(e.target.value))}
						min={minValue}
						max={value[1]}
						className={cn(
							'bg-ctp-surface0 text-ctp-text border-ctp-overlay0 w-20 rounded border p-1 text-center',
						)}
						aria-label='Minimal value'
					/>
					<span className='mx-2 text-gray-500'>-</span>
					<input
						type='number'
						value={value[1]}
						onChange={(e) => handleInputChange(1, Number(e.target.value))}
						min={value[0]}
						max={maxValue}
						className={cn(
							'bg-ctp-surface0 text-ctp-text border-ctp-overlay0 w-20 rounded border p-1 text-center',
						)}
						aria-label='Maximal value'
					/>
				</div>
			)}
		</>
	);
};

export default RangeSlider;
