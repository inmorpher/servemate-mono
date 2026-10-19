import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const eslintConfig = [
	{ ignores: ['.github/**', 'scripts/**', 'src/app/tests/**'] },
	...nextCoreWebVitals,
	...nextTypescript,
	{
		plugins: {
			'react-hooks': reactHooksPlugin,
		},
		rules: {
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'react-hooks/immutability': 'off',
			'react-hooks/purity': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/set-state-in-effect': 'off',
			'react-hooks/exhaustive-deps': 'warn',
		},
	},
];

export default eslintConfig;
