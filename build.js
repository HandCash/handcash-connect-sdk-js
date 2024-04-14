import { build } from 'esbuild-wasm';
import module from './package.json' assert { type: "json" };

const entryFile = 'src/index.ts';
const shared = {
   bundle: true,
   entryPoints: [entryFile],
   // Treat all dependencies in package.json as externals to keep bundle size to a minimum
   external: [
      ...Object.keys(module.dependencies),
      ...Object.keys(module.devDependencies || {}),
   ],
   logLevel: 'info',
   minify: true,
   platform: 'node',
   target: ['node18'],
};

build({
   ...shared,
   format: 'esm',
   outfile: './dist/index.esm.js',
});

build({
   ...shared,
   format: 'cjs',
   outfile: './dist/index.cjs',
});
