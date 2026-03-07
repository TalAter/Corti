import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/corti.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
  },
  {
    entry: ['src/corti.ts'],
    format: ['iife'],
    globalName: 'corti',
    minify: true,
    outExtension: () => ({ js: '.iife.min.js' }),
  },
]);
