const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    optimization: {
      minimize: true,
      removeAvailableModules: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 500000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            reuseExistingChunk: true,
          },
          api: {
            name: "api",
            test: /[\\/]src[\\/]api[\\/]/,
            reuseExistingChunk: true,
          },
          views: {
            test: /[\\/]src[\\/]views[\\/]/,
            reuseExistingChunk: true,
          },
          common: {
            test: /[\\/]src[\\/]components[\\/]/,
            reuseExistingChunk: true,
          },
        },
      },
    },
    resolve: {
      fallback: {
        "console": false,
        "assert": false,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer")
      }
    }
  },
})
