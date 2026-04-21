<template>
  <el-upload
    :disabled="preview"
    :accept="field.accept"
    :before-upload="beforeUpload"
    action="#"
    :auto-upload="false"
    :on-change="onChange"
  >
    <el-button :disabled="preview" size="small">
      <el-icon><Upload /></el-icon> 點擊上傳
    </el-button>
    <template #tip>
      <div v-if="field.accept" style="font-size:11px;color:#909399">
        支持格式：{{ field.accept }}
        <span v-if="field.maxSize">，大小不超過 {{ field.maxSize }}MB</span>
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import type { UploadRawFile } from 'element-plus'
import type { FormField } from '@/api/types/workflow'

const props = defineProps<{ field: FormField; preview?: boolean; modelValue?: File }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: File): void }>()

function beforeUpload(file: UploadRawFile) {
  if (props.field.maxSize && file.size / 1024 / 1024 > props.field.maxSize) {
    return false
  }
  return true
}

function onChange({ raw }: { raw: File }) {
  emit('update:modelValue', raw)
}
</script>
