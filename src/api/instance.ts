import request from '@/utils/request'
import type { ProcessInstanceVO, StartProcessRequest } from './types/workflow'

export function startProcess(data: StartProcessRequest) {
    return request.post<any, ProcessInstanceVO>('/api/instance/start', data)
}

export function listInstances(processKey?: string) {
    return request.get<any, ProcessInstanceVO[]>('/api/instance/list', { params: { processKey } })
}

export function suspendInstance(instanceId: string) {
    return request.put<any, void>(`/api/instance/suspend/${instanceId}`)
}

export function activateInstance(instanceId: string) {
    return request.put<any, void>(`/api/instance/activate/${instanceId}`)
}

export function deleteInstance(instanceId: string, reason?: string) {
    return request.delete<any, void>(`/api/instance/delete/${instanceId}`, { params: { reason } })
}