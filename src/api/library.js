import request from '@/utils/request'

/**
 * 获取用户游戏库列表
 */
export function getUserLibrary() {
  return request({
    url: '/api/library/user/games',
    method: 'get'
  })
}

/**
 * 启动游戏
 */
export function launchGame(gameId) {
  return request({
    url: `/api/library/launch/${gameId}`,
    method: 'post'
  })
}

/**
 * 安装游戏
 */
export function installGame(gameId) {
  return request({
    url: `/api/library/install/${gameId}`,
    method: 'post'
  })
}

/**
 * 卸载游戏
 */
export function uninstallGame(gameId) {
  return request({
    url: `/api/library/uninstall/${gameId}`,
    method: 'post'
  })
}

/**
 * 切换收藏状态
 */
export function toggleFavorite(gameId) {
  return request({
    url: `/api/library/favorite/${gameId}`,
    method: 'post'
  })
}