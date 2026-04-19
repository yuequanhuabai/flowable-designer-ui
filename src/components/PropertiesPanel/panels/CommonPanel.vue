<template>
  <el-form :model="form" label-width="90px" size="small">
    <el-form-item label="元素 ID">
      <el-input v-model="form.id" @change="updateProperty('id', form.id)" />
    </el-form-item>
    <el-form-item label="名稱">
      <el-input v-model="form.name" @change="updateProperty('name', form.name)" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{ element: any; modeler: any }>()

const form = reactive({ id: '', name: '' })

watch(() => props.element, (el) => {
  if (!el) return
  const bo = el.businessObject
  form.id = bo?.id || ''
  form.name = bo?.name || ''
}, { immediate: true })

function updateProperty(key: string, value: string) {
  props.modeler?.get('modeling')?.updateProperties(props.element, { [key]: value })
}
</script>
