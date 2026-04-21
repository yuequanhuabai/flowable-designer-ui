<template>
  <div class="canvas-wrapper">
    <draggable
      :list="localFields"
      group="fields"
      item-key="id"
      class="canvas-drop-zone"
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

      <template #footer>
        <div v-if="localFields.length === 0" class="canvas-empty">
          <el-icon size="40" color="#c0c4cc"><Plus /></el-icon>
          <p>從左側拖入字段開始設計</p>
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

const localFields = ref<FormField[]>([])

// splice 原地修改，保持 localFields.value 的數組引用不變
// vuedraggable 內部 Sortable 實例持有這個引用，替換會導致後續拖入失效
watch(() => props.fields, (v) => {
  localFields.value.splice(0, localFields.value.length, ...v)
}, { immediate: true })

function getFieldComponent(type: string) { return FIELD_MAP[type] || InputField }

function removeField(id: string) {
  const idx = localFields.value.findIndex(f => f.id === id)
  if (idx !== -1) localFields.value.splice(idx, 1)
  emit('update:fields', [...localFields.value])
  if (props.selectedId === id) emit('select', null)
}

function onDraggableChange() {
  emit('update:fields', [...localFields.value])
}
</script>

<style scoped lang="scss">
.canvas-wrapper {
  min-height: 100%;
}
.canvas-drop-zone {
  min-height: 300px;
  height: 100%;
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
  pointer-events: none;
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
