<template>
  <el-form ref="formRef" :model="formData" label-width="100px" size="default">
    <template v-for="field in schema.fields" :key="field.id">
      <el-form-item
        :label="field.label"
        :prop="field.field"
        :rules="field.required
          ? [{ required: true, message: `${field.label}不能為空`, trigger: ['blur', 'change'] }]
          : []"
      >
        <component
          :is="getComponent(field.type)"
          :field="field"
          :preview="preview"
          v-model="formData[field.field]"
        />
      </el-form-item>
    </template>

    <div v-if="schema.fields.length === 0" class="no-fields">
      該節點未配置表單字段
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FormSchema } from '@/api/types/workflow'
import InputField    from '@/components/FormDesigner/fields/InputField.vue'
import TextareaField from '@/components/FormDesigner/fields/TextareaField.vue'
import NumberField   from '@/components/FormDesigner/fields/NumberField.vue'
import SelectField   from '@/components/FormDesigner/fields/SelectField.vue'
import RadioField    from '@/components/FormDesigner/fields/RadioField.vue'
import CheckboxField from '@/components/FormDesigner/fields/CheckboxField.vue'
import DateField     from '@/components/FormDesigner/fields/DateField.vue'
import UploadField   from '@/components/FormDesigner/fields/UploadField.vue'

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

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, any>): void
}>()

const formRef = ref<FormInstance>()
const formData = reactive<Record<string, any>>({})

watch(() => props.modelValue, (v) => {
  if (v) Object.assign(formData, v)
}, { immediate: true })

watch(formData, (v) => emit('update:modelValue', { ...v }), { deep: true })

function getComponent(type: string) { return FIELD_MAP[type] || InputField }

async function validate(): Promise<boolean> {
  if (!formRef.value) return true
  return formRef.value.validate().then(() => true).catch(() => false)
}

function getValues(): Record<string, any> { return { ...formData } }

defineExpose({ validate, getValues })
</script>

<style scoped lang="scss">
.no-fields {
  text-align: center;
  color: #c0c4cc;
  padding: 20px 0;
  font-size: 13px;
}
</style>
