module.exports = {
  roots: [
    'test',
  ],
  verbose: true,
  testRegex: 'test/.*?.js$',
  testURL: 'http://localhost',
  collectCoverage: true,
  collectCoverageFrom: [
    './index.js',
  ],
};
