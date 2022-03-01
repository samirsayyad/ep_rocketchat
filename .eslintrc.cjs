'use strict';

// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('eslint-config-etherpad/patch/modern-module-resolution');

module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    jquery: true,
    mocha: true,
  },
  root: true,
  extends: 'etherpad',
  rules: {
    'max-len': 0,
  },
  globals: {
    clientVars: true,
    pad: true,
  },
};
