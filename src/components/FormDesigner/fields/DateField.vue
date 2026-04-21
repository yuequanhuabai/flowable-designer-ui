<template>
  <el-date-picker
    :model-value="preview ? '' : modelValue"
    :format="field.dateFormat || 'YYYY-MM-DD'"
    :value-format="field.dateFormat || 'YYYY-MM-DD'"
    :disabled="preview"
    style="width:100%"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import type { FormField } from '@/api/types/workflow'
defineProps<{ field: FormField; preview?: boolean; modelValue?: string }>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>
