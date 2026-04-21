<template>
  <el-form :model="formData" label-width="100px">
    <el-form-item
      v-for="field in schema.fields"
      :key="field.id"
      :label="field.label"
      :required="field.required"
    >
      <component
        :is="getFieldComponent(field.type)"
        :field="field"
        :preview="preview"
        :model-value="formData[field.field]"
        @update:model-value="formData[field.field] = $event"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { FormSchema } from '@/api/types/workflow'
import InputField from '@/components/FormDesigner/fields/InputField.vue'
import TextareaField from '@/components/FormDesigner/fields/TextareaField.vue'
import NumberField from '@/components/FormDesigner/fields/NumberField.vue'
import SelectField from '@/components/FormDesigner/fields/SelectField.vue'
import RadioField from '@/components/FormDesigner/fields/RadioField.vue'
import CheckboxField from '@/components/FormDesigner/fields/CheckboxField.vue'
import DateField from '@/components/FormDesigner/fields/DateField.vue'
import UploadField from '@/components/FormDesigner/fields/UploadField.vue'

const FIELD_MAP: Record<string, any> = {
  input: InputField, textarea: TextareaField, number: NumberField,
  select: SelectField, radio: RadioField, checkbox: CheckboxField,
  date: DateField, upload: UploadField,
}

const props = defineProps<{
  schema: FormSchema
  preview?: boolean
  modelValue?: Record<string, any>
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: Record<string, any>): void }>()

const formData = reactive<Record<string, any>>(props.modelValue || {})

function getFieldComponent(type: string) { return FIELD_MAP[type] || InputField }
</script>
