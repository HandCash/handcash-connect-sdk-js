import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		target: 'node16',
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'HandCash Connect SDK',
			fileName: 'index',
		},
		rollupOptions: {
			external: ['bsv-wasm', 'undici'],
			output: {
				globals: {
					'bsv-wasm': 'BsvWasm',
					undici: 'Undici',
				},
			},
		},
	},
	plugins: [dts()],
});
