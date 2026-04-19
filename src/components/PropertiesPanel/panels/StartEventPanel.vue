<template>
  <el-form :model="form" label-width="90px" size="small">
    <el-form-item label="元素 ID">
      <el-input v-model="form.id" @change="updateProperty('id', form.id)" />
    </el-form-item>
    <el-form-item label="名稱">
      <el-input v-model="form.name" @change="updateProperty('name', form.name)" />
    </el-form-item>

    <el-divider content-position="left">發起人配置</el-divider>

    <el-form-item label="發起人變量">
      <el-input
        v-model="form.initiator"
        placeholder="如：initiator"
        @change="updateFlowableProperty('initiator', form.initiator)"
      />
      <div class="tip">流程啓動時自動將發起人寫入此變量，後續任務可用 ${initiator} 引用</div>
    </el-form-item>

    <el-divider content-position="left">發起表單</el-divider>

    <el-form-item label="表單 Key">
      <el-input
        v-model="form.formKey"
        placeholder="如：apply-form"
        @change="updateFlowableProperty('formKey', form.formKey)"
      />
      <div class="tip">業務系統根據此 Key 渲染發起流程時的填寫表單</div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{ element: any; modeler: any }>()

const form = reactive({ id: '', name: '', initiator: '', formKey: '' })

watch(() => props.element, (el) => {
  if (!el) return
  const bo = el.businessObject
  form.id = bo?.id || ''
  form.name = bo?.name || ''
  form.initiator = bo?.initiator || ''
  form.formKey = bo?.formKey || ''
}, { immediate: true })

function updateProperty(key: string, value: string) {
  props.modeler?.get('modeling')?.updateProperties(props.element, { [key]: value })
}

function updateFlowableProperty(key: string, value: string) {
  props.modeler?.get('modeling')?.updateProperties(props.element, { [key]: value || undefined })
}
</script>

<style scoped lang="scss">
.tip {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.5;
}
</style>
