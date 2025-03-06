import axios,{ type AxiosRequestConfig } from 'axios'
import { api } from '.'

//目前就前两种主流 Content-Type:application/x-www-form-urlencoded;  Content-Type:application/json;
//上传文件一般不用通用接口，忽略
export type RequestType = 'form' | 'json'
const defaultRequestType = 'json'

export type ResponseType<T = unknown> = {
  code?: number
  data?: T
  msg?: string
}

export const get = <T = unknown>(
  url: string,
  params: Record<string, unknown> = {},
  options: AxiosRequestConfig<unknown> = {},
): Promise<[ResponseType<T> | null, unknown]> => {
  return new Promise((resolve) => {
    api
      .get(url, { params, ...options })
      .then((result) => {
        const res: ResponseType<T> = result.data
        if (res.code === 200) {
          resolve([null, res])
        } else if (res.code === -1) {
          //这种一般是有效，可以直接提示
          resolve([res, null])
        } else {
          //仍然是错误的，需要提示，这种一般统一提示，此时res就是错误err了
          resolve([res, null])
        }
      })
      .catch((err) => {
        //错误的，需要提示，这种一般统一提示，此时res就是错误err了
        resolve([err, null])
      })
  })
}

export const post = <T = unknown>(
  url: string,
  data: Record<string, unknown> = {},
  options: AxiosRequestConfig = {},
  requestType: RequestType = defaultRequestType,
): Promise<[ResponseType<T> | null, unknown]> => {
  return new Promise((resolve) => {
    const headers = options.headers || {}
    if (requestType === 'json') {
      headers['Content-Type'] = 'application/json'
    } else if (requestType === 'form') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    api
      .post(url, data, {
        ...options,
        headers,
      })
      .then((result) => {
        const res: ResponseType<T> = result.data
        if (res.code === 200) {
          resolve([null, res])
        } else if (res.code === -1) {
          //这种一般是有效，可以直接提示
          resolve([res, null])
        } else {
          //仍然是错误的，需要提示，这种一般统一提示，此时res就是错误err了
          resolve([res, null])
        }
      })
      .catch((err) => {
        //错误的，需要提示，这种一般统一提示，此时res就是错误err了
        resolve([err, null])
      })
  })
}

///options.onUploadProgress进度条
export const upload = (url: string, data: FormData, options: AxiosRequestConfig = {}) => {
  // Content-Type:multipart/form-data
  return axios.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...options,
  })
}
