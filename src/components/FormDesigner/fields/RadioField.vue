<template>
  <el-radio-group
    :model-value="preview ? '' : modelValue"
    :disabled="preview"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-radio v-for="opt in field.options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import type { FormField } from '@/api/types/workflow'
defineProps<{ field: FormField; preview?: boolean; modelValue?: string }>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>
