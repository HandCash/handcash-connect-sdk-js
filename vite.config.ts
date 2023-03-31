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
			external: ['bsv-wasm', 'undici', 'nanoid'],
			output: {
				globals: {
					'bsv-wasm': 'BsvWasm',
					undici: 'Undici',
					nanoid: 'Nanoid',
				},
			},
		},
	},
	plugins: [dts()],
});
