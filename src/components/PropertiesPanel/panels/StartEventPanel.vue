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
      <div class="tip">流程啓動時記錄發起人的變量名，運行時自動賦值</div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{ element: any; modeler: any }>()

const form = reactive({ id: '', name: '', initiator: '' })

watch(() => props.element, (el) => {
  if (!el) return
  const bo = el.businessObject
  form.id = bo?.id || ''
  form.name = bo?.name || ''
  form.initiator = bo?.initiator || ''
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
}
</style>
