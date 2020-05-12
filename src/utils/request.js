/**
 * 封装 axios 请求模块
 */
import axios from 'axios'

// 在非组件模块中获取store的方式 和组件中this.$store一样
import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
})

// 请求拦截器 (Interceptors)
request.interceptors.request.use(function (config) {
  const { user } = store.state
  // 如果已登录,则统一给接口设置token信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后一定要返回config,否则请求就会停在这里
  return config
}, function (error) {
  return Promise.reject(error)
})

// 导出
export default request
