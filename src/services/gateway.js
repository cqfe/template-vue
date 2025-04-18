import Service from '@/utils/request'
import { getToken } from '@/utils/auth'

const gatewayService = new Service(
  {
    baseURL: import.meta.env.VITE_GLOB_API_URL,
    timeout: 5000,
  },
  (config) => {
    const token = getToken() || '1'
    if (token) {
      config.headers.Authorization = token
    }
  },
  undefined,
  undefined,
)

export const service = gatewayService.request
export default gatewayService
