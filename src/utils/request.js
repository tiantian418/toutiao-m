/**
 * 封装 axios 请求模块
 */
import axios from 'axios'

import JSONbig from 'json-bigint'

import { Toast } from 'vant'

// 在非组件模块中获取store的方式 和组件中this.$store一样
import store from '@/store'

import router from '@/router/'

const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

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

// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response.status

  if (status === 400) {
    // 客户端请求参数错误
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token 无效
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转到登录页
      return redirectLogin()
    }

    // 使用 refresh_token 请求获取新的 token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // 拿到新的 token 之后把它更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)

      // 把失败的请求重新发出去
      // error.config 是本次请求的相关配置信息对象
      // 这里使用 request 发请求，它会走自己的拦截器
      // 它的请求拦截器中通过 store 容器访问 token 数据
      return request(error.config)
    } catch (err) {
      // 刷新 token 都失败了，直接跳转登录页
      redirectLogin()
    }
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务端异常
    Toast.fail('服务端异常，请稍后重试')
  }

  // 抛出异常
  return Promise.reject(error)
})

function redirectLogin () {
  router.replace({
    name: 'login',
    query: {
      redirect: router.currentRouter.fullPath
    }
  })
}

// 导出
export default request
