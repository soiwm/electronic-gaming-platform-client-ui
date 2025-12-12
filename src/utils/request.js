import axios from 'axios';
import { getToken, clearToken, isTokenExpired } from './auth';

// 创建 axios 实例
const service = axios.create({
  baseURL: '', // 依赖代理前缀 /api
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加用户令牌并在客户端侧做过期兜底
    const token = getToken()
    console.log('请求拦截器 - 请求URL:', config.url)
    console.log('请求拦截器 - 获取的token:', token)
    if (token && !isTokenExpired(token)) {
      config.headers['Authorization'] = 'Bearer ' + token
      console.log('请求拦截器 - 已添加Authorization头:', config.headers['Authorization'])
    } else if (token && isTokenExpired(token)) {
      console.log('请求拦截器 - token已过期，清除token')
      clearToken()
    } else {
      console.log('请求拦截器 - 没有有效的token')
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
    if (error?.response?.status === 401) {
      clearToken()
      // 统一抛出 401，让页面侧决定跳转
    }
    console.error('网络错误：', error.message);
    return Promise.reject(error);
  }
);

export default service;