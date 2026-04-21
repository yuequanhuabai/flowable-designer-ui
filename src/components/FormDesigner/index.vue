<template>
  <div class="form-designer">
    <FieldPanel class="designer-left" />
    <Canvas
      class="designer-center"
      :fields="fields"
      :selected-id="selectedId"
      @update:fields="$emit('update:fields', $event)"
      @select="$emit('select', $event)"
    />
    <ConfigPanel
      class="designer-right"
      :field="selectedField"
      @update="handleFieldUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FieldPanel from './FieldPanel.vue'
import Canvas from './Canvas.vue'
import ConfigPanel from './ConfigPanel.vue'
import type { FormField } from '@/api/types/workflow'

const props = defineProps<{
  fields: FormField[]
  selectedId: string | null
}>()

const emit = defineEmits<{
  (e: 'update:fields', v: FormField[]): void
  (e: 'select', id: string | null): void
}>()

const selectedField = computed(() =>
  props.fields.find(f => f.id === props.selectedId) || null
)

function handleFieldUpdate(updated: FormField) {
  const newFields = props.fields.map(f => f.id === updated.id ? updated : f)
  emit('update:fields', newFields)
}
</script>

<style scoped lang="scss">
.form-designer {
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 0;
}
.designer-left  { width: 200px; flex-shrink: 0; background: #fff; border-right: 1px solid #dcdfe6; }
.designer-center { flex: 1; overflow-y: auto; background: #f5f7fa; padding: 16px; }
.designer-right { width: 260px; flex-shrink: 0; background: #fff; border-left: 1px solid #dcdfe6; }
</style>
