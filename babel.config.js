module.exports = api => {
  const plugins = [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime'
  ];
  if (api.cache.invalidate(() => process.env.NODE_ENV === 'development')) {
    plugins.push('react-refresh/babel');
  }

  return {
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic'
        }
      ],
      [
        '@babel/preset-env',
        {
          targets: 'defaults'
        }
      ]
    ],
    plugins
  };
};
