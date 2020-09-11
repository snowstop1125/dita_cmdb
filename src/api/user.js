import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/portal/login!submit',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/portal/logout!index',
    method: 'post'
  })
}
