import base from './playwright.config.mjs';
export default {
  ...base,
  testMatch: ['foobow.sanctuary.spec.mjs', 'foobow.dive.spec.mjs'],
  outputDir: 'test-results-sanctuary',
  webServer: { command: 'python -u -m http.server 4187 --bind 127.0.0.1 --directory prototype', url: 'http://127.0.0.1:4187/sanctuary/', reuseExistingServer: !process.env.CI, timeout: 30000 }
};
