import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: 'src/index.ts',
			name: 'HandCash Connect SDK',
			fileName: 'index',
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: [],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {},
			},
		},
	},
	plugins: [dts()],
});
