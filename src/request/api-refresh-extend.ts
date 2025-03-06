import { api } from "."

//拦截器处理响应体 response，我们顺便做一个无感刷新的
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { data, config } = error.response

    if (data.statusCode === 401 && !config.url.includes('/refresh')) {
      const res = await refreshToken()
      //使用config重发
      if (res.status === 200) {
        return api(config)
      } else {
        alert(data.message || '登录过期，请重新登录')
      }
    } else {
      //如果有需要处理其他的也可以直接罗列，非正常的错误，都不给用户展示，可以直接打印
      return error.response
    }
  },
)

const refreshToken = async () => {
  const res = await api.get('/refresh', {
    params: {
      token: localStorage.getItem('refresh_token'),
    },
  })
  localStorage.setItem('token', res.data.accessToken)
  localStorage.setItem('refresh_token', res.data.refreshToken)
  return res
}
