<template>
  <div class="canvas-wrapper">
    <div v-if="localFields.length === 0" class="canvas-empty">
      <el-icon size="40" color="#c0c4cc"><Plus /></el-icon>
      <p>從左側拖入字段開始設計</p>
    </div>

    <draggable
      :list="localFields"
      group="fields"
      item-key="id"
      handle=".drag-handle"
      :class="{ 'empty-drop-zone': localFields.length === 0 }"
      @change="onDraggableChange"
    >
      <template #item="{ element }">
        <div
          class="canvas-field"
          :class="{ 'is-selected': selectedId === element.id }"
          @click="$emit('select', element.id)"
        >
          <el-icon class="drag-handle"><Rank /></el-icon>
          <div class="field-preview">
            <div class="field-label">
              <span v-if="element.required" class="required-mark">*</span>
              {{ element.label || '（未命名）' }}
            </div>
            <component
              :is="getFieldComponent(element.type)"
              :field="element"
              :preview="true"
            />
          </div>
          <el-icon class="delete-btn" @click.stop="removeField(element.id)">
            <Delete />
          </el-icon>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import type { FormField } from '@/api/types/workflow'
import InputField from './fields/InputField.vue'
import TextareaField from './fields/TextareaField.vue'
import NumberField from './fields/NumberField.vue'
import SelectField from './fields/SelectField.vue'
import RadioField from './fields/RadioField.vue'
import CheckboxField from './fields/CheckboxField.vue'
import DateField from './fields/DateField.vue'
import UploadField from './fields/UploadField.vue'

const FIELD_MAP: Record<string, any> = {
  input: InputField, textarea: TextareaField, number: NumberField,
  select: SelectField, radio: RadioField, checkbox: CheckboxField,
  date: DateField, upload: UploadField,
}

const props = defineProps<{ fields: FormField[]; selectedId: string | null }>()
const emit = defineEmits<{
  (e: 'update:fields', v: FormField[]): void
  (e: 'select', id: string | null): void
}>()

const localFields = ref<FormField[]>([...props.fields])

// 父組件初始化數據（如從後端加載）時同步進來，始終用展開副本避免共享引用
watch(() => props.fields, (v) => {
  localFields.value = [...v]
})

function getFieldComponent(type: string) { return FIELD_MAP[type] || InputField }

function removeField(id: string) {
  localFields.value = localFields.value.filter(f => f.id !== id)
  emit('update:fields', [...localFields.value])
  if (props.selectedId === id) emit('select', null)
}

// vuedraggable 拖入/排序後觸發，顯式 emit 給父組件
function onDraggableChange() {
  emit('update:fields', [...localFields.value])
}
</script>

<style scoped lang="scss">
.canvas-wrapper {
  min-height: 100%;
  position: relative;
}
.canvas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #c0c4cc;
  font-size: 14px;
  gap: 8px;
}
.empty-drop-zone {
  position: absolute;
  inset: 0;
  min-height: 300px;
}
.canvas-field {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover { border-color: #dcdfe6; }
  &.is-selected { border-color: #409eff; }
}
.drag-handle {
  cursor: grab;
  color: #c0c4cc;
  margin-top: 4px;
  flex-shrink: 0;
  &:active { cursor: grabbing; }
}
.field-preview { flex: 1; }
.field-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #303133;
}
.required-mark { color: #f56c6c; margin-right: 2px; }
.delete-btn {
  color: #c0c4cc;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 4px;
  &:hover { color: #f56c6c; }
}
</style>
