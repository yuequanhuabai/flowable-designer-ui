<template>
  <el-input-number
    :model-value="preview ? null : (modelValue ?? null)"
    :min="field.min"
    :max="field.max"
    :placeholder="field.placeholder"
    :disabled="preview"
    controls-position="right"
    style="width:100%"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import type { FormField } from '@/api/types/workflow'
defineProps<{ field: FormField; preview?: boolean; modelValue?: number }>()
defineEmits<{ (e: 'update:modelValue', v: number): void }>()
</script>
