module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npx serve -s build -l 3000',
      startServerReadyPattern: 'serving|ready',
      startServerReadyTimeout: 10000,
      url: [
        'http://localhost:3000',
        'http://localhost:3000/#/games',
        'http://localhost:3000/#/weather'
      ],
      numberOfRuns: 1,
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
      },
    },
    assert: {
      assertions: {
        'categories:pwa': ['warn', {minScore: 0.6}],
        'categories:performance': ['warn', {minScore: 0.5}],
        'categories:accessibility': ['warn', {minScore: 0.8}],
        'categories:best-practices': ['warn', {minScore: 0.7}],
        'categories:seo': ['warn', {minScore: 0.8}],
        'network-dependency-tree-insight': 'off',
        'cache-insight': 'off',
        'render-blocking-insight': 'off',
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
