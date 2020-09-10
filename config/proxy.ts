/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
     target: 'http://10.11.2.61:8082',
     // target: 'http://localhost:8082',
      changeOrigin: true,
      pathRewrite: { '/api/': '/' },
    },
  },
  test: {
    '/api/': {
      target: 'http://localhost:8082',
      changeOrigin: true,
      //pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'http://10.11.4.194:8080',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
