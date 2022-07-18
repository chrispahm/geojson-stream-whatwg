import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

const input = "./src/main.mjs";

export default [
	// browser-friendly UMD build
	{
		input,
		output: {
			name: 'geojson-stream-whatwg',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve({browser: true}),
			commonjs()
		]
	},
	{
		input,
		output: { file: pkg.module, format: 'es' },
		plugins: [
			resolve({
        browser: true
      }),
      commonjs()
		]
	},
	{
		input,
		external: ['@streamparser/json'],
		output: { file: pkg.main, format: 'cjs', exports: "default" }
	}
];