import base from './playwright.config.mjs';

export default {
  ...base,
  testMatch: ['foobow.quiet-games.spec.mjs'],
  outputDir: 'test-results-sanctuary',
};
