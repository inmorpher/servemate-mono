import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
	turbopack: {
		root: path.join(__dirname),
	},
	allowedDevOrigins: ['192.168.2.70', '192.168.2.47'],
	env: {
		API_URL: process.env.API_URL || 'http://localhost:3002/api',
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
	},
	async headers() {
		return [
			{
				source: '/:path^',
				headers: [
					{
						key: 'Permission-Policy',
						value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
					},
				],
			},
		];
	},
	reactCompiler: {
		compilationMode: 'all',
	},
};

export default nextConfig;
