import request from '@/utils/request'
import type { TaskVO, CompleteTaskRequest } from './types/workflow'

export function getTodoTasks(assignee: string) {
    return request.get<any, TaskVO[]>('/api/task/todo', { params: { assignee } })
}

export function completeTask(data: CompleteTaskRequest) {
    return request.post<any, void>('/api/task/complete', data)
}

export function rejectTask(taskId: string, comment?: string) {
    return request.post<any, void>('/api/task/reject', null, { params: { taskId, comment } })
}

export function delegateTask(taskId: string, targetUserId: string) {
    return request.post<any, void>('/api/task/delegate', null, { params: { taskId, targetUserId } })
}