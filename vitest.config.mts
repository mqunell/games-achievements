import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	test: {
		css: true,
		environment: 'jsdom',
		globals: true,
		setupFiles: ['dotenv/config', './src/testing/setupTests.ts'],
	},
});
