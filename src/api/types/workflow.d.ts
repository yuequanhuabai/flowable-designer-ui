// 流程定義
export interface ProcessDefinitionVO {
    id: string
    key: string
    name: string
    version: number
    deploymentId: string
    resourceName: string
    suspended: boolean
}

// 流程實例
export interface ProcessInstanceVO {
    instanceId: string
    processDefinitionId: string
    processDefinitionKey: string
    processDefinitionName: string
    businessKey: string
    startUserId: string
    startTime: string
    suspended: boolean
}

// 任務
export interface TaskVO {
    taskId: string
    taskName: string
    taskDefinitionKey: string
    assignee: string
    processInstanceId: string
    processDefinitionId: string
    businessKey: string
    createTime: string
    suspended: boolean
}

// 發起流程請求
export interface StartProcessRequest {
    processKey: string
    businessKey: string
    variables?: Record<string, any>
}

// 完成任務請求
export interface CompleteTaskRequest {
    taskId: string
    comment?: string
    variables?: Record<string, any>
}