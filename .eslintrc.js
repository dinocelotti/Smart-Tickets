module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	parserOptions: {
		ecmaVersion: 8,
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true,
		},
		sourceType: 'module',
	},
	plugins: ['react', 'async-await'],
	rules: {
		'consistent-return': 2,
		'linebreak-style': [2, 'unix'],
		'no-case-declarations': 0,
		'no-else-return': 1,
		semi: [1, 'never'],
		quotes: [1, 'single'],
		'space-unary-ops': 2,
		'no-console': [1, { allow: ['warn', 'error', 'log'] }],
		'no-unused-vars': 1,
		'react/prop-types': [1],
		'react/display-name': [1],
	},
}
