<template>
  <el-form :model="form" label-width="90px" size="small">
    <el-form-item label="連線名稱">
      <el-input v-model="form.name" @change="updateProperty('name', form.name)" />
    </el-form-item>

    <el-form-item label="條件表達式">
      <el-input
          v-model="form.conditionExpression"
          type="textarea"
          :rows="3"
          placeholder="如：${approved == true}"
          @change="updateCondition"
      />
      <div class="tip">用於排他網關出口，控制流程走向</div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{ element: any; modeler: any }>()

const form = reactive({
  name: '',
  conditionExpression: ''
})

watch(() => props.element, (el) => {
  if (!el) return
  const bo = el.businessObject
  form.name = bo?.name || ''
  form.conditionExpression = bo?.conditionExpression?.body || ''
}, { immediate: true })

function updateProperty(key: string, value: string) {
  props.modeler?.get('modeling')?.updateProperties(props.element, { [key]: value })
}

function updateCondition() {
  const modeling = props.modeler?.get('modeling')
  const moddle = props.modeler?.get('moddle')
  if (!modeling || !moddle) return

  if (form.conditionExpression) {
    const condExpr = moddle.create('bpmn:FormalExpression', {
      body: form.conditionExpression
    })
    modeling.updateProperties(props.element, { conditionExpression: condExpr })
  } else {
    modeling.updateProperties(props.element, { conditionExpression: undefined })
  }
}
</script>

<style scoped lang="scss">
.tip {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
}
</style>