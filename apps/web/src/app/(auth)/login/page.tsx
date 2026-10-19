import LoginFormContent from '@/features/auth/login-form/ui/LoginForm';
import { Suspense } from 'react';

function LoginFormSkeleton() {
	return (
		<div className='space-y-4'>
			<div className='bg-ctp-surface0 h-12 animate-pulse rounded-md' />
			<div className='bg-ctp-surface0 h-12 animate-pulse rounded-md' />
			<div className='bg-ctp-surface0 h-10 animate-pulse rounded-md' />
		</div>
	);
}

export default function LoginPage() {
	return (
		<div className='bg-ctp-base flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8'>
				<div>
					<h2 className='text-ctp-mauve mt-6 text-center text-3xl font-extrabold'>
						Log in to your account
					</h2>
					<p className='text-ctp-subtext0 mt-2 text-center text-sm'>
						Enter your email and password to log in.
					</p>
				</div>
				<Suspense fallback={<LoginFormSkeleton />}>
					<LoginFormContent />
				</Suspense>
			</div>
		</div>
	);
}
