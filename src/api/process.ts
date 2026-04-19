import request from '@/utils/request'
import type { ProcessDefinitionVO } from './types/workflow'

// 查詢流程定義列表
export function listProcessDefinitions() {
    return request.get<any, ProcessDefinitionVO[]>('/api/process/list')
}

// 通過文件上傳部署流程
export function deployProcess(name: string, file: File) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('file', file)
    return request.post<any, string>('/api/process/deploy', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

// 通過 XML 字符串部署（前端設計器核心入口）
export function deployByXml(name: string, processKey: string, bpmnXml: string) {
    return request.post<any, string>(
        `/api/process/deploy-xml?name=${encodeURIComponent(name)}&processKey=${encodeURIComponent(processKey)}`,
        bpmnXml,
        { headers: { 'Content-Type': 'application/xml' } }
    )
}

// 刪除部署
export function deleteDeployment(deploymentId: string) {
    return request.delete<any, void>(`/api/process/delete/${deploymentId}`)
}

// 獲取流程 XML（後端返回裸 XML，需繞過統一響應拆包）
export function getProcessResource(processDefinitionId: string) {
    return request.get<any, string>(
        `/api/process/resource/${processDefinitionId}`,
        { responseType: 'text' }
    )
}