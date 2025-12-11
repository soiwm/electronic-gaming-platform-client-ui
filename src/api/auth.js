import request from '@/utils/request';

// 客户登录获取 JWT
export function login(data) {
  return request({
    url: '/api/auth/customer/login',
    method: 'post',
    data
  });
}