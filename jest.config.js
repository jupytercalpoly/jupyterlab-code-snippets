const path = require('path');

module.exports = {
  verbose: true,
  preset: 'ts-jest/presets/js-with-babel',
  transform: {
<<<<<<< HEAD
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
=======
    '^.+\\.tsx?$': 'ts-jest'
>>>>>>> Remove unnecessary setup
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