<template>
  <div class="field-panel">
    <div class="panel-title">字段類型</div>
    <draggable
      :list="FIELD_TYPES"
      :group="{ name: 'fields', pull: 'clone', put: false }"
      :clone="cloneField"
      item-key="type"
      :sort="false"
    >
      <template #item="{ element }">
        <div class="field-type-item">
          <el-icon><component :is="element.icon" /></el-icon>
          <span>{{ element.label }}</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import type { FormField } from '@/api/types/workflow'

const FIELD_TYPES = [
  { type: 'input',    label: '單行文本', icon: 'Minus' },
  { type: 'textarea', label: '多行文本', icon: 'Document' },
  { type: 'number',   label: '數字',     icon: 'Coin' },
  { type: 'select',   label: '下拉選擇', icon: 'ArrowDown' },
  { type: 'radio',    label: '單選',     icon: 'CirclePlus' },
  { type: 'checkbox', label: '多選',     icon: 'Finished' },
  { type: 'date',     label: '日期',     icon: 'Calendar' },
  { type: 'upload',   label: '附件上傳', icon: 'Upload' },
]

function cloneField(item: typeof FIELD_TYPES[0]): FormField {
  return {
    id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: item.type as FormField['type'],
    label: item.label,
    field: '',
    required: false,
    placeholder: '',
    options: ['select', 'radio', 'checkbox'].includes(item.type)
      ? [{ label: '選項一', value: 'option1' }]
      : undefined
  }
}
</script>

<style scoped lang="scss">
.field-panel {
  padding: 12px 8px;
  height: 100%;
  overflow-y: auto;
}
.panel-title {
  font-size: 12px;
  color: #909399;
  padding: 0 4px 8px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 8px;
}
.field-type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin-bottom: 4px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: grab;
  font-size: 13px;
  background: #fff;
  transition: all 0.2s;
  user-select: none;
  &:hover {
    border-color: #409eff;
    color: #409eff;
    background: #ecf5ff;
  }
  &:active { cursor: grabbing; }
}
</style>
