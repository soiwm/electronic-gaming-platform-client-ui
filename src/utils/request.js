import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: '', // 依赖代理前缀 /api
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加用户令牌
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      console.error('接口错误：', res.msg);
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    console.error('网络错误：', error.message);
    return Promise.reject(error);
  }
);

export default service;