import request from '@/utils/request'

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

export function listHrUsers(): Promise<HrUser[]> {
  return request.get('/hr-api/internal/user/simple-list')
}

export function listHrRoles(): Promise<HrRole[]> {
  return request.get('/hr-api/internal/role/simple-list')
}
