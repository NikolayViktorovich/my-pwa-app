module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npx serve -s build -l 3000',
      url: ['http://localhost:3000', 'http://localhost:3000/#/games'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:pwa': ['warn', {minScore: 0.8}],
        'categories:performance': ['warn', {minScore: 0.7}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.8}],
        'categories:seo': ['warn', {minScore: 0.8}],
        'unused-css-rules': 'off',
        'unused-javascript': 'off',
        'uses-text-compression': 'off',
        'uses-long-cache-ttl': 'off',
        'render-blocking-resources': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
