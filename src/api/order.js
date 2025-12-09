import request from '@/utils/request';

// 创建订单
export function createOrder(orderData) {
  return request({
    url: '/api/order/create',
    method: 'post',
    data: orderData
  });
}

// 查询用户订单列表
export function getUserOrders() {
  return request({
    url: '/api/order/user/list',
    method: 'get'
  });
}