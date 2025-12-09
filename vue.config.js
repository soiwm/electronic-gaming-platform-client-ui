// vue.config.js 正确配置（Vue CLI 项目）
module.exports = {
  devServer: {
    port: 8081, // 客户端运行端口（避免和后端冲突）
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 管理端后端地址
        changeOrigin: true, // 开启跨域
        pathRewrite: { '^/api': '' } // 路径重写（保持接口前缀一致）
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src') // 配置 @ 指向 src
      }
    }
  }
}