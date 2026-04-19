<template>
  <el-form :model="form" label-width="90px" size="small">
    <el-form-item label="任務名稱">
      <el-input v-model="form.name" @change="updateProperty('name', form.name)" />
    </el-form-item>

    <el-divider content-position="left">辦理人配置</el-divider>

    <el-form-item label="指定辦理人">
      <el-input
          v-model="form.assignee"
          placeholder="如：${manager} 或固定用戶名"
          @change="updateFlowableProperty('assignee', form.assignee)"
      />
      <div class="tip">支持流程變量表達式，如 ${manager}</div>
    </el-form-item>

    <el-form-item label="候選用戶">
      <el-input
          v-model="form.candidateUsers"
          placeholder="多個用逗號分隔：user1,user2"
          @change="updateFlowableProperty('candidateUsers', form.candidateUsers)"
      />
    </el-form-item>

    <el-form-item label="候選角色組">
      <el-input
          v-model="form.candidateGroups"
          placeholder="多個用逗號分隔：group1,group2"
          @change="updateFlowableProperty('candidateGroups', form.candidateGroups)"
      />
    </el-form-item>

    <el-divider content-position="left">其他</el-divider>

    <el-form-item label="表單 Key">
      <el-input
          v-model="form.formKey"
          placeholder="如：leave-form"
          @change="updateFlowableProperty('formKey', form.formKey)"
      />
    </el-form-item>

    <el-form-item label="到期時間">
      <el-input
          v-model="form.dueDate"
          placeholder="如：${dueDate} 或 2024-12-31"
          @change="updateFlowableProperty('dueDate', form.dueDate)"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{ element: any; modeler: any }>()

const form = reactive({
  name: '',
  assignee: '',
  candidateUsers: '',
  candidateGroups: '',
  formKey: '',
  dueDate: ''
})

// 元素變化時，同步讀取已有屬性
watch(() => props.element, (el) => {
  if (!el) return
  const bo = el.businessObject
  form.name = bo?.name || ''
  form.assignee = bo?.assignee || ''
  form.candidateUsers = bo?.candidateUsers || ''
  form.candidateGroups = bo?.candidateGroups || ''
  form.formKey = bo?.formKey || ''
  form.dueDate = bo?.dueDate || ''
}, { immediate: true })

// 更新 BPMN 標準屬性（name 等）
function updateProperty(key: string, value: string) {
  const modeling = props.modeler?.get('modeling')
  modeling?.updateProperties(props.element, { [key]: value })
}

// 更新 Flowable 擴展屬性（flowable:assignee 等）
function updateFlowableProperty(key: string, value: string) {
  const modeling = props.modeler?.get('modeling')
  modeling?.updateProperties(props.element, { [key]: value || undefined })
}
</script>

<style scoped lang="scss">
.tip {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
}
</style>