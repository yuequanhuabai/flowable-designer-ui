import request from '@/utils/request'
import type { FormDefinitionVO, FormSchema } from './types/workflow'

export function listForms(): Promise<FormDefinitionVO[]> {
  return request.get('/api/form/list')
}

export function getFormByKey(formKey: string): Promise<FormDefinitionVO> {
  return request.get(`/api/form/${formKey}`)
}

export function createForm(data: { formKey: string; name: string }): Promise<FormDefinitionVO> {
  return request.post('/api/form', data)
}

export function updateForm(id: string, schema: FormSchema): Promise<FormDefinitionVO> {
  return request.put(`/api/form/${id}`, { schemaJson: JSON.stringify(schema) })
}

export function deleteForm(id: string): Promise<void> {
  return request.delete(`/api/form/${id}`)
}

export function parseSchema(vo: FormDefinitionVO): FormSchema {
  try {
    return JSON.parse(vo.schemaJson)
  } catch {
    return { formKey: vo.formKey, name: vo.name, fields: [] }
  }
}
