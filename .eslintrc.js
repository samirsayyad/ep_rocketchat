module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'commonjs': true,
		'es6': true,
		'jquery': true
	},
	'globals': {
		'$': true,
		'it': true,
		'describe': true,
		'process': true,
		'before': true,
		'beforeEach':true,
		'afterEach':true,
		'xit':true,
		'clientVars':true,
		'pad':true

	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
