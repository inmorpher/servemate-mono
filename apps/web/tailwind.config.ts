import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/features/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/shared/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/providers/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				ctp: {
					// Base
					rosewater: '#f5e0dc',
					flamingo: '#f2cdcd',
					pink: '#f5c2e7',
					mauve: '#cba6f7',
					red: '#f38ba8',
					maroon: '#eba0ac',
					peach: '#fab387',
					yellow: '#f9e2af',
					green: '#a6e3a1',
					teal: '#94e2d5',
					sky: '#89dceb',
					sapphire: '#74c7ec',
					blue: '#89b4fa',
					lavender: '#b4befe',

					// Surface
					text: 'red',
					subtext1: '#d0d4f8',
					subtext0: '#b0b5db',
					overlay2: '#8691af',
					overlay1: '#6f7793',
					overlay0: '#5a5e7a',
					surface2: '#3f4155',
					surface1: '#2d2d40',
					surface0: '#1c1b2f',

					// Background
					base: '#080810',
					mantle: '#05060f',
					crust: '#020311',
				},
				spacing: {
					'14.25': '3.5625rem', // header height
					'70': '17.5rem', // filters width
				},
			},
		},
	},
	plugins: [],
};

export default config;
