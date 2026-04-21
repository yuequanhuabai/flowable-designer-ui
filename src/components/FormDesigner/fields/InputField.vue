<template>
  <el-input
    :model-value="preview ? '' : modelValue"
    :placeholder="field.placeholder || `請輸入${field.label}`"
    :disabled="preview"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import type { FormField } from '@/api/types/workflow'
defineProps<{ field: FormField; preview?: boolean; modelValue?: string }>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>
