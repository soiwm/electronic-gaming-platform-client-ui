// vue.config.js 正确配置（Vue CLI 项目）
module.exports = {
  devServer: {
    port: 7070, // 客户端运行端口（避免和后端冲突）
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 管理端后端地址
        changeOrigin: true, // 开启跨域
        pathRewrite: { '^/api': '' } // 路径重写（保持接口前缀一致）
      },
      // 配置静态资源代理：所有以 /images 开头的请求都会被转发到后端
      '/images': {
        target: 'http://localhost:8080', // 后端 Spring Boot 项目地址
        changeOrigin: true, // 开启跨域支持
        ws: true, // 配置支持 websocket
        secure: false // 忽略 SSL 证书错误
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