import request from '@/utils/request'
import type { ProcessDraftVO } from './types/workflow'

export function listDrafts() {
    return request.get<ProcessDraftVO[]>('/draft/list')
}

export function getDraft(id: string) {
    return request.get<ProcessDraftVO>(`/draft/${id}`)
}

export function createDraft(data: { name: string; processKey: string; bpmnXml: string }) {
    return request.post<ProcessDraftVO>('/draft', data)
}

export function updateDraft(id: string, data: { name: string; processKey: string; bpmnXml: string }) {
    return request.put<ProcessDraftVO>(`/draft/${id}`, data)
}

export function deleteDraft(id: string) {
    return request.delete(`/draft/${id}`)
}
