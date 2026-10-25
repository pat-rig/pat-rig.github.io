// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default tseslint.config(
  // public/count.js is GoatCounter's script, vendored verbatim.
  { ignores: ['dist/', '.astro/', 'node_modules/', 'public/count.js'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
);
