const func = require('@jupyterlab/testutils/lib/jest-config');
module.exports = func(__dirname);
// const path = require('path');

// module.exports = {
//   verbose: false,
//   preset: 'ts-jest/presets/js-with-babel',
//   transform: {
//     '^.+\\.tsx?$': 'ts-jest',
//     '^.+\\.(js|jsx)$': 'babel-jest'
//   },
//   setupFiles: ['<rootDir>/testutils/jest-setup-files.js'],
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   testPathIgnorePatterns: ['/lib/', '/node_modules/'],
//   coverageReporters: ['json', 'lcov', 'text', 'html'],
//   coverageDirectory: path.join('./', 'coverage'),
//   testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
//   globals: {
//     'ts-jest': {
//       tsconfig: './tsconfig.test.json'
//     }
//   }
// };