import path = require('path');

const config = function(baseDir: string) {
  return {
    preset: 'ts-jest/presets/js-with-babel',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['/node_modules/(?!(@jupyterlab/.*)/)'],
    reporters: ['default', 'jest-junit', 'jest-summary-reporter'],
    coverageReporters: ['json', 'lcov', 'text', 'html'],
    coverageDirectory: path.join(baseDir, 'coverage'),
    testRegex: '/test/.*.ts[x]?$',
    globals: {
      'ts-jest': {
        tsConfig: 'tsconfig.test.json'
      }
    }
  };
};

module.exports = config(__dirname);
