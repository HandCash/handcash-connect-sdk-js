import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		target: 'node14',
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'HandCash Connect SDK',
			fileName: 'index',
		},
		rollupOptions: {
			external: ['bsv-wasm', 'axios', 'nanoid'],
			output: {
				globals: {
					'bsv-wasm': 'bsvWasm',
					axios: 'axios',
					nanoid: 'nanoid',
				},
			},
		},
	},
	plugins: [dts()],
});
