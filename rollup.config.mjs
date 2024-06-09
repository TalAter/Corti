export default {
  input: 'src/corti.js',
  output: [
    {
      file: 'dist/corti.js',
      format: 'iife',
      name: 'corti',
      sourcemap: true,
    },
    {
      file: 'dist/corti.mjs.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/corti.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  ],
};
