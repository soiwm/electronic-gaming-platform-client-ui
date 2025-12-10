// Token 工具：存取与过期检测
const TOKEN_KEY = 'token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// 基于 JWT 的 exp 字段（秒）判断是否过期
export function isTokenExpired(token = getToken()) {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || ''))
    const exp = payload.exp
    if (!exp) return false
    const nowSec = Math.floor(Date.now() / 1000)
    return exp <= nowSec
  } catch (e) {
    // 非法 token 视为失效
    return true
  }
}

export function getTokenPayload(token = getToken()) {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1] || ''))
  } catch (e) {
    return null
  }
}


