import { getToken } from '@/utils/auth'

export function reData(data = {},ver = '1.0') {
  let obj = {
    "con": data,
    "head": {
      "cmd":10000,
      "ver": ver,
      "token": getToken()
    }
  }
  return obj
}