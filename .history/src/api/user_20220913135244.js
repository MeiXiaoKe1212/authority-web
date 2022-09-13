import http from '@/utils/request'

/**
 *  用户登录
 *  @returns
 */
export async function login(data) {
  return await http.login('/api/user/login', data)
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
