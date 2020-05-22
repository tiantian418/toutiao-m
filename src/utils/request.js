/**
 * 封装 axios 请求模块
 */
import axios from 'axios'

import JSONbig from 'json-bigint'

// 在非组件模块中获取store的方式 和组件中this.$store一样
import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  // baseURL: 'http://api-toutiao-web.itheima.net',
  transformResponse: [function (data) {
    // 后端返回的数据可能不是JSON格式的字符串,为了不报错,此时使用try-catch来捕获异常,处理异常的发生
    try {
      // axios默认在内部使用的是JSON.parse来转换处理原始数据
      // 如果转换成功,则直接返回结果
      return JSONbig.parse(data)
    } catch (err) {
      // 如果转换失败,则原封不动的直接返回给请求使用
      return data
    }
  }]
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
