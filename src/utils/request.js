import axios from 'axios'
import { notification } from 'ant-design-vue'

function blob2Json(blob) {
  if (!blob) return ''
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.readAsText(blob, 'UTF-8')
    fr.onload = async (e) => {
      resolve(JSON.parse(e.target.result.toString()).message)
    }
    fr.onerror = reject
  })
}

class Service {
  /**
   * 构造函数，用于创建 HTTP 请求的实例
   *
   * @param config axios 配置对象
   * @param beforeReq 请求前的回调函数，接收 axios 配置对象作为参数
   * @param afterRes 响应后的回调函数，接收 axios 响应对象作为参数
   * @param ignoreError 响应后忽略错误
   */
  constructor(config, beforeReq, afterRes, ignoreError) {
    this.ignoreError = ignoreError
    this.service = axios.create({
      withCredentials: true,
      timeout: 0,
      ...config,
    })
    this.service.interceptors.request.use(
      (config) => {
        if (beforeReq) {
          beforeReq(config)
        }
        return config
      },
      (error) => {
        if (axios.isCancel(error)) {
          return
        }
        console.error(error) // for debug
        return Promise.reject(error)
      },
    )

    this.service.interceptors.response.use(
      (response) => {
        if (afterRes) {
          afterRes(response)
        }
        const res = response.data
        if (response.config.responseType === 'blob') {
          return response
        }
        const hideError = response.config?.headers?.Error === '0'
        if (!res.status && !hideError) {
          this.logError(res.message)
          return Promise.reject(new Error(res.message || 'Error'))
        } else {
          return res
        }
      },
      async (error) => {
        if (axios.isCancel(error)) {
          return
        }
        let message = error?.response?.data?.message || error.message
        if (error.config?.responseType === 'blob') {
          message = await blob2Json(error?.response?.data)
        }
        const hideError = error.config?.headers?.Error === '0'
        if (!hideError) {
          this.logError(message)
        }
        return Promise.reject(error)
      },
    )
  }

  logError = (message) => {
    if (this.ignoreError) return
    notification.destroy()
    notification.error({
      message: message || '请求失败',
    })
  }

  request = (config) => {
    return this.service.request(config)
  }

  get = (url, config) => {
    return this.service.get(url, config)
  }

  post = (url, data, config) => {
    return this.service.post(url, data, config)
  }

  put = (url, data, config) => {
    return this.service.put(url, data, config)
  }

  delete = (url, config) => {
    return this.service.delete(url, config)
  }

  patch = (url, data, config) => {
    return this.service.patch(url, data, config)
  }

  head = (url, config) => {
    return this.service.head(url, config)
  }

  options = (url, config) => {
    return this.service.options(url, config)
  }
}

export default Service
