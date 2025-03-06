import axios, { type InternalAxiosRequestConfig } from 'axios'

export const instance = axios.create({
  baseURL: '',
  timeout: 15000,
})

//拦截器处理请求体 request
instance.interceptors.request.use((config) => {
  //可以做token处理，也可以做其他的
  config = handleAuth(config)
  // handleRequestType(config)
  return config
})

//我们将内部参数 requestType 当做一个多态参数
// const handleRequestType = <T extends InternalAxiosRequestConfig>(config: T) => {
//   const requestType = (config as unknown as requestType).requestType
//   if (requestType === 'json') {
//     config.headers['Content-Type'] = 'application/json'
//   } else if (requestType === 'form') {
//     config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
//   }
//   if (requestType) {
//     delete config['requestType']
//   }
// }

let token: string = ''

const handleAuth = <T>(config: T) => {
  //处理token，当然 token第一次获取到保存起来就行，没必要每次都 getItem
  token = token || localStorage.getItem('token') || ''
  return {
    ...config,
    'X-Auth-Token': token,
    // 'token': token,
  }
}

export const removeToken = () => {
  token = ''
}

export const api = instance
