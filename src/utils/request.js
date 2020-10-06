import axios from 'axios'
import { Message } from 'element-ui'
import session from '@/utils/session.js'

// 请求基准路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.timeout = 5000

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.authorization = session.get('token')
  return config
})

// 响应拦截器
axios.interceptors.response.use(res => {
  const { meta } = res.data
  if (meta.status !== 200) {
    Message({
      type: 'error',
      message: meta.msg || ''
    })
  } else {
    Message({
      type: 'success',
      message: meta.msg || '',
      duration: 500
    })
  }
  return res
})
