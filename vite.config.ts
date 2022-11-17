import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'HandCash Connect SDK',
			fileName: 'index',
		},
		rollupOptions: {
			external: ['bsv-wasm', 'axios'],
			output: {
				globals: {
					'bsv-wasm': 'bsvWasm',
					axios: 'axios',
				},
			},
		},
	},
	plugins: [dts()],
});
