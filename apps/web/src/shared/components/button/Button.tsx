import { cn } from '@/shared/utils/classNames';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ctp-blue disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-ctp-text focus-visible:ring-offset-1 focus-visible:ring-ctp-blue corner-squircle cursor-pointer',
	{
		variants: {
			variant: {
				default: 'hover:bg-ctp-blue  shadow hover:bg-ctp-sapphire',
				destructive:
					' shadow-sm hover:bg-ctp-red active:bg-ctp-red/70  text-ctp-surface0 bg-ctp-red/90 ',
				outline:
					'border border-ctp-surface1 bg-ctp-surface0 text-ctp-text shadow-sm hover:bg-ctp-surface1',
				secondary: 'bg-ctp-surface1 text-ctp-text shadow-sm hover:bg-ctp-surface2',
				ghost: 'hover:bg-ctp-surface2 hover:text-ctp-text text-ctp-text/80',
				link: 'text-ctp-blue underline-offset-4 hover:underline',
				chip: 'bg-ctp-surface0 ring-ctp-surface1 focus-visible:ring-ctp-blue  ring-1 focus-visible:ring-2',
				unstyled: '',
			},
			size: {
				default: 'h-12 px-4 py-2',
				sm: 'h-10 rounded-md px-3 text-xs',
				xs: 'h-8 rounded-md px-2 text-xs',
				lg: 'h-14 rounded-md px-8',
				icon: 'h-12 w-12',
				bare: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant, size, asChild = false, children, 'aria-label': ariaLabel, ...props },
		ref,
	) => {
		const Comp = asChild ? Slot : 'button';

		const isIconOnly = size === 'icon' && !children;
		if (isIconOnly && !ariaLabel && !props['aria-busy']) {
			console.warn('Icon-only buttons should have an aria-label for accessibility.');
		}

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				aria-label={ariaLabel}
				type={Comp === 'button' ? 'button' : undefined}
				{...props}
			>
				{children}
			</Comp>
		);
	},
);
Button.displayName = 'Button';

export { Button, buttonVariants };
