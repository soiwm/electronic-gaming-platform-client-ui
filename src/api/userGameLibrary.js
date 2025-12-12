import request from '@/utils/request';

// 检查用户是否已购买游戏
export function checkUserPurchasedGame(gameId) {
  return request({
    url: `/api/userGameLibrary/check/${gameId}`,
    method: 'get'
  });
}

// 获取用户游戏库列表
export function getUserGameLibrary() {
  return request({
    url: '/api/userGameLibrary/list',
    method: 'get'
  });
}

// 更新游戏安装状态
export function updateGameInstallStatus(gameId, isInstalled) {
  return request({
    url: `/api/userGameLibrary/install/${gameId}`,
    method: 'post',
    data: { isInstalled }
  });
}

// 更新游戏收藏状态
export function updateGameFavoriteStatus(gameId, isFavorite) {
  return request({
    url: `/api/userGameLibrary/favorite/${gameId}`,
    method: 'post',
    data: { isFavorite }
  });
}