import axios from 'axios'

export interface HrUser {
  userId: number
  username: string
  nickname: string
}

export interface HrRole {
  roleId: number
  roleName: string
  roleKey: string
}

const hrRequest = axios.create({ timeout: 10000 })

hrRequest.interceptors.response.use(
  (res) => (res.data?.code === 200 ? res.data.data : Promise.reject(res.data)),
  (err) => Promise.reject(err)
)

export function listHrUsers(): Promise<HrUser[]> {
  return hrRequest.get('/hr-api/internal/user/simple-list')
}

export function listHrRoles(): Promise<HrRole[]> {
  return hrRequest.get('/hr-api/internal/role/simple-list')
}
