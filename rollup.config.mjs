import { readFileSync } from 'fs';
const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `//! Corti - A mock implementation of the browser's SpeechRecognition for automated testing
//! version : ${version}
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://github.com/TalAter/Corti`;

export default {
  input: 'src/corti.js',
  output: [
    {
      file: 'dist/corti.js',
      format: 'iife',
      name: 'corti',
      sourcemap: true,
      banner,
    },
    {
      file: 'dist/corti.mjs',
      format: 'esm',
      sourcemap: true,
      banner,
    },
    {
      file: 'dist/corti.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      banner,
    },
  ],
};
