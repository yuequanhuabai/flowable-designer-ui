<template>
  <el-form :model="form" label-width="90px" size="small">
    <el-form-item label="元素 ID">
      <el-input v-model="form.id" @change="updateProperty('id', form.id)" />
    </el-form-item>
    <el-form-item label="名稱">
      <el-input v-model="form.name" @change="updateProperty('name', form.name)" />
    </el-form-item>

    <el-divider content-position="left">發起人配置</el-divider>

    <el-form-item label="發起人變量">
      <el-input
        v-model="form.initiator"
        placeholder="如：initiator"
        @change="updateFlowableProperty('initiator', form.initiator)"
      />
      <div class="tip">流程啓動時自動將發起人寫入此變量</div>
    </el-form-item>

    <el-divider content-position="left">發起表單</el-divider>

    <el-form-item label="表單 Key">
      <el-select
        v-model="form.formKey"
        placeholder="選擇關聯表單"
        clearable
        style="width:100%"
        @change="updateFlowableProperty('formKey', form.formKey)"
      >
        <el-option
          v-for="f in formList"
          :key="f.formKey"
          :label="`${f.name}（${f.formKey}）`"
          :value="f.formKey"
        />
      </el-select>
      <div class="tip">選擇發起流程時需要填寫的表單</div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { listForms } from '@/api/form'
import type { FormDefinitionVO } from '@/api/types/workflow'

const props = defineProps<{ element: any; modeler: any }>()

const form = reactive({ id: '', name: '', initiator: '', formKey: '' })
const formList = ref<FormDefinitionVO[]>([])

onMounted(async () => {
  try {
    formList.value = await listForms()
  } catch {
    // 表單服務不可用時靜默跳過
  }
})

watch(() => props.element, (el) => {
  if (!el) return
  const bo = el.businessObject
  form.id = bo?.id || ''
  form.name = bo?.name || ''
  form.initiator = bo?.initiator || ''
  form.formKey = bo?.formKey || ''
}, { immediate: true })

function updateProperty(key: string, value: string) {
  props.modeler?.get('modeling')?.updateProperties(props.element, { [key]: value })
}

function updateFlowableProperty(key: string, value: string) {
  props.modeler?.get('modeling')?.updateProperties(props.element, { [key]: value || undefined })
}
</script>

<style scoped lang="scss">
.tip {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.5;
}
</style>
