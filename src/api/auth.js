import request from '@/utils/request';

// 登录获取 JWT
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  });
}


