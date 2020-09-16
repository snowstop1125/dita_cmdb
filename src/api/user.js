import request from '@/utils/request'
import { reData } from '@/api/moudle'

// 2.1获取验证码
export function getCaptcha(data) {
  return request({
    url: '/portal/login!captcha1',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 2.2用户登录(验证码)
export function login(data) {
  data = reData(data)
  return request({
    url: '/portal/login!submit',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  let data = reData()
  return request({
    url: '/portal/logout!index',
    method: 'post',
    data
  })
}
