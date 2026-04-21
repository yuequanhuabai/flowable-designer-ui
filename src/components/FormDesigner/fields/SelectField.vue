<template>
  <el-select
    :model-value="preview ? '' : modelValue"
    :placeholder="`請選擇${field.label}`"
    :disabled="preview"
    style="width:100%"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-option
      v-for="opt in field.options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import type { FormField } from '@/api/types/workflow'
defineProps<{ field: FormField; preview?: boolean; modelValue?: string }>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>
