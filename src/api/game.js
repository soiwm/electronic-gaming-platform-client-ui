import request from '@/utils/request';

// 查询游戏列表
export function getGameList() {
  return request({
    url: '/api/game/list',
    method: 'get'
  });
}

// 根据 ID 查询游戏详情
export function getGameDetail(id) {
  return request({
    url: `/api/game/${id}`,
    method: 'get'
  });
}