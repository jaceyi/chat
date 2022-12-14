module.exports = api => {
  const plugins = [['@babel/plugin-transform-runtime']];
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
