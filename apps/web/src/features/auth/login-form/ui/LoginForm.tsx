'use client';

import { ILoginFormInputs, loginAction } from '@/features/auth/actions/login';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const LoginFormContent = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginFormInputs>();

	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const callbackUrl = searchParams.get('callbackUrl') || '/cpanel';

	const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
		try {
			setIsLoading(true);
			setError(null);

			await loginAction(data, callbackUrl);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ошибка входа');
			setIsLoading(false);
		}
	};

	return (
		<>
			{error && (
				<div className='bg-ctp-red/20 mb-4 rounded-md p-4'>
					<div className='text-ctp-red text-sm'>{error}</div>
				</div>
			)}

			<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
				<div className='-space-y-px rounded-md shadow-sm'>
					<div>
						<label htmlFor='email-address' className='sr-only'>
							Email
						</label>
						{errors.email && (
							<p className='text-ctp-red mt-1 px-2 text-xs'>{errors.email.message}</p>
						)}
						<input
							id='email-address'
							{...register('email', {
								required: 'Email required',
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: 'Please enter valid email',
								},
							})}
							name='email'
							type='email'
							autoComplete='email'
							className='bg-ctp-surface0 border-ctp-overlay0 placeholder-ctp-subtext0 text-ctp-text focus:ring-ctp-lavender focus:border-ctp-lavender relative block w-full appearance-none rounded-t-md border px-3 py-2 focus:z-10 focus:outline-none sm:text-sm'
							placeholder='Email'
						/>
					</div>
					<div>
						<label htmlFor='password' className='sr-only'>
							Пароль
						</label>
						<input
							id='password'
							{...register('password', {
								required: 'Password required',
								minLength: {
									value: 6,
									message: 'Password must be at least 6 characters long',
								},
							})}
							type='password'
							autoComplete='current-password'
							className='bg-ctp-surface0 border-ctp-overlay0 placeholder-ctp-subtext0 text-ctp-text focus:ring-ctp-lavender focus:border-ctp-lavender relative block w-full appearance-none rounded-b-md border px-3 py-2 focus:z-10 focus:outline-none sm:text-sm'
							placeholder='Password'
						/>
						{errors.password && (
							<p className='text-ctp-red mt-1 px-2 text-xs'>
								{errors.password.message}
							</p>
						)}
					</div>
				</div>

				<div>
					<button
						type='submit'
						disabled={isLoading}
						className='group text-ctp-crust bg-ctp-blue hover:bg-ctp-sapphire focus:ring-ctp-lavender disabled:bg-ctp-blue/70 relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none'
					>
						{isLoading ? 'Загрузка...' : 'Войти'}
					</button>
				</div>
			</form>
		</>
	);
};

export default LoginFormContent;
