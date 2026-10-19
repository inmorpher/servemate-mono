import { cn } from '@/shared/utils/classNames';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef, HTMLAttributes } from 'react';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

// Reusable AlertDialog components with consistent styling
const AlertDialogContent = forwardRef<
	ComponentRef<typeof AlertDialogPrimitive.Content>,
	ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Portal>
		<AlertDialogPrimitive.Overlay className='data-[state=open]:animate-in data-[state=closed]: animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/50' />
		<AlertDialogPrimitive.Content
			ref={ref}
			className={cn(
				'corner-squircle border-ctp-surface1 bg-ctp-base data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-95 fixed top-1/2 left-1/2 w-auto -translate-x-1/2 -translate-y-1/2 rounded-4xl border p-5 shadow-lg',
				className,
			)}
			{...props}
		></AlertDialogPrimitive.Content>
	</AlertDialogPrimitive.Portal>
));

AlertDialogContent.displayName = 'AlertDialogContent';

// Simple wrapper components for AlertDialog structure
export const AlertDialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('mb-4 w-50', className)} {...props} />
);

AlertDialogHeader.displayName = 'AlertDialogHeader';

// Footer component with right-aligned buttons
export const AlertDialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('mt-4 flex justify-end gap-2', className)} {...props} />
);

AlertDialogFooter.displayName = 'AlertDialogFooter';

// Title, Description, Action, and Cancel components with consistent styling
const AlertDialogTitle = forwardRef<
	ComponentRef<typeof AlertDialogPrimitive.Title>,
	ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Title
		ref={ref}
		className={cn('text-ctp-text text-lg font-semibold', className)}
		{...props}
	/>
));

AlertDialogTitle.displayName = 'AlertDialogTitle';

// Title, Description, Action, and Cancel components with consistent styling
const AlertDialogDescription = forwardRef<
	ComponentRef<typeof AlertDialogPrimitive.Description>,
	ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Description
		ref={ref}
		className={cn('text-ctp-subtext0 py-2', className)}
		{...props}
	/>
));

AlertDialogDescription.displayName = 'AlertDialogDescription';

// Title, Description, Action, and Cancel components with consistent styling
const AlertDialogAction = forwardRef<
	ComponentRef<typeof AlertDialogPrimitive.Action>,
	ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Action ref={ref} className={cn('text-sm', className)} {...props} />
));

AlertDialogAction.displayName = 'AlertDialogAction';

// 	Title, Description, Action, and Cancel components with consistent styling
const AlertDialogCancel = forwardRef<
	ComponentRef<typeof AlertDialogPrimitive.Cancel>,
	ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Cancel ref={ref} className={cn('text-sm', className)} {...props} />
));

AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
};
