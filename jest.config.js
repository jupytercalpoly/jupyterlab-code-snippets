const path = require('path');

module.exports = {
  roots: ['<rootDir>'],
  verbose: true,
  preset: 'ts-jest/presets/js-with-babel',
  // moduleNameMapper: {
  //   '\\.(css|less|sass|scss)$': '<rootDir>/',
  //   '\\.(gif|ttf|eot)$': '@jupyterlab/testutils/lib/jest-file-mock.js'
  // },
  transform: {
    // '\\.svg$': 'jest-raw-loader',
    // '^.+\\.md?$': 'markdown-loader-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  setupFiles: ['<rootDir>/testutils/jest-setup-files.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  coverageDirectory: path.join('./', 'coverage'),
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json'
    }
  }
};