const nodeResolver = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const svelte = require('rollup-plugin-svelte');
const replace = require('rollup-plugin-replace');
const json = require('rollup-plugin-json');
const string = require('rollup-plugin-string');

const banner = `
/*!
 * Copyright 2017, nju33
 * Released under the MIT License
 * https://github.com/nju33/rangebar
 */
`.trim();

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  banner,
  cache: null,
  entry: 'lib/rangebar.js',
  plugins: [
    nodeResolver({jsnext: true}),
    commonjs({include: 'node_modules/**'}),
    svelte({include: 'lib/components/*.html'}),
    babel({
      include: 'lib/**/*+(js|html)',
      runtimeHelpers: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    }),
    json({include: 'lib/**/*.json'}),
    string({include: 'lib/**/*.css'})
  ]
};
