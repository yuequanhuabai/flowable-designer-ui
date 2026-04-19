<template>
  <el-form :model="form" label-width="90px" size="small">
    <el-form-item label="流程名稱">
      <el-input v-model="form.name" @change="updateProperty('name', form.name)" />
    </el-form-item>

    <el-form-item label="流程 ID">
      <el-input v-model="form.id" disabled />
      <div class="tip">部署後作為 processKey，建議使用有意義的英文標識</div>
    </el-form-item>

    <el-form-item label="是否可執行">
      <el-switch v-model="form.isExecutable" @change="updateProperty('isExecutable', form.isExecutable)" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{ element: any; modeler: any }>()

const form = reactive({
  id: '',
  name: '',
  isExecutable: true
})

watch(() => props.element, (el) => {
  if (!el) return
  const bo = el.businessObject
  form.id = bo?.id || ''
  form.name = bo?.name || ''
  form.isExecutable = bo?.isExecutable !== false
}, { immediate: true })

function updateProperty(key: string, value: any) {
  props.modeler?.get('modeling')?.updateProperties(props.element, { [key]: value })
}
</script>

<style scoped lang="scss">
.tip {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
}
</style>