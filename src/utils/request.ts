import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// 後端統一響應結構
export interface ApiResponse<T = any> {
    code: number
    message: string
    data: T
}

const request = axios.create({
    baseURL: '/workflow',       // 通過 vite proxy 轉發到 http://localhost:9090/workflow
    timeout: 30000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 請求攔截器（預留 token 位置）
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config
    },
    (error) => Promise.reject(error)
)

// 響應攔截器
request.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        // 非 JSON（XML / 圖片 / 文本）直接返回原始數據，不走統一拆包
        const contentType = response.headers['content-type'] || ''
        if (
            response.config.responseType === 'text' ||
            response.config.responseType === 'blob' ||
            response.config.responseType === 'arraybuffer' ||
            contentType.includes('xml') ||
            contentType.includes('image')
        ) {
            return response.data
        }

        const res = response.data as ApiResponse
        if (res?.code !== 200) {
            ElMessage.error(res?.message || '請求失敗')
            return Promise.reject(new Error(res?.message))
        }
        return res.data
    },
    (error) => {
        ElMessage.error(error.message || '網絡錯誤')
        return Promise.reject(error)
    }
)

export default request