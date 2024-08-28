// vue.config.js
module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        https: require.resolve('https-browserify'),
      },
    },
  },
};
