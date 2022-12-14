import http from '@/utils/request'

/**
 *  用户登录
 *  @returns
 */
export async function login(data) {
  return await http.login('/api/user/login', data)
}

/**
 *  获取用户信息和权限信息
 *  @returns
 */
export async function getInfo() {
  return await http.get('/api/sysUser/getUserInfo')
}

/**
 *  退出登录
 *  @returns
 */
export async function logout(param) {
  return await http.post('/api/sysUser/logOut', param)
}

