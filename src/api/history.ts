import request from '@/utils/request'

export function listFinishedInstances(processKey?: string) {
    return request.get<any, any[]>('/api/history/instances', { params: { processKey } })
}

export function getActivities(instanceId: string) {
    return request.get<any, any[]>(`/api/history/activities/${instanceId}`)
}

export function getComments(instanceId: string) {
    return request.get<any, any[]>(`/api/history/comments/${instanceId}`)
}

// 流程圖高亮 URL（直接用於 <img :src=""> 標籤）
export function getDiagramUrl(instanceId: string) {
    return `/workflow/api/history/diagram/${instanceId}`
}