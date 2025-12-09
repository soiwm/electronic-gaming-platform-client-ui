import request from '@/utils/request';

// 获取用户游戏库列表
export function getUserLibrary() {
  return request({
    url: '/api/library/user/games',
    method: 'get'
  });
}

// 启动游戏（模拟）
export function launchGame(gameId) {
  return request({
    url: `/api/library/launch/${gameId}`,
    method: 'post'
  });
}

// 卸载游戏（模拟）
export function uninstallGame(gameId) {
  return request({
    url: `/api/library/uninstall/${gameId}`,
    method: 'post'
  });
}