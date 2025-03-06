import type { AxiosRequestConfig } from 'axios'
import { api } from '.'

export type ResponseType<T = unknown> = {
  code?: number
  data?: T
  msg?: string
}

// export const request = <T>(url: string, options: AxiosRequestConfig) => {
//   return api.request<T>({
//     url,
//     ...options,
//   })
// }

// export const request = <T>(url: string, options: AxiosRequestConfig) => {
//   return new Promise((resolve, reject) => {
//     api
//       .request<T>({
//         url,
//         ...options,
//       })
//       .then((result) => {
//         resolve(result.data)
//       })
//       .catch(reject)
//   })
// }

//silent 0 不静默都提示，1仅仅提示有效，2全都不提示
export const request = <T extends ResponseType<T>>(
  url: string,
  options: AxiosRequestConfig,
  silent = 0,
): Promise<ResponseType<T> | undefined> => {
  return new Promise((resolve) => {
    api
      .request<T>({
        url,
        ...options,
      })
      .then((result) => {
        const res: ResponseType<T> = result.data
        if (res.code === 200) {
          resolve(res)
          return
        } else if (res.code === -1) {
          return Promise.reject(res)
        } else {
          return Promise.reject()
        }
      })
      .catch((err) => {
        //存在有效提示就有效提示，不存在且静默，那就不提示
        if (silent === 2) {
          return
        }
        if (err?.msg) {
          alert(err?.msg)
        } else {
          alert('似乎断开了与网络的连接')
        }
      })
  })
}
