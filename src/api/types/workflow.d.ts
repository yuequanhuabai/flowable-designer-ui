// 流程定義
export interface ProcessDefinitionVO {
    id: string
    key: string
    name: string
    version: number
    deploymentId: string
    resourceName: string
    suspended: boolean
    formKey?: string
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

// ========== 表單設計器 ==========

export interface FormField {
    id: string
    type: 'input' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'upload'
    label: string
    field: string
    required: boolean
    placeholder?: string
    defaultValue?: string
    options?: { label: string; value: string }[]
    min?: number
    max?: number
    dateFormat?: string
    accept?: string
    maxSize?: number
}

export interface FormSchema {
    formKey: string
    name: string
    fields: FormField[]
}

export interface ProcessDraftVO {
    id: string
    name: string
    processKey: string
    bpmnXml: string
    createTime?: string
    updateTime?: string
}

export interface FormDefinitionVO {
    id: string
    formKey: string
    name: string
    schemaJson: string
    version: number
    createTime?: string
    updateTime?: string
}