<template>
  <div class="designer-page">
    <div class="designer-toolbar">
      <span class="form-title">{{ formName }}</span>
      <div class="toolbar-actions">
        <el-button @click="handlePreview">預覽</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </div>

    <FormDesigner
      v-model:fields="fields"
      :selected-id="selectedId"
      @select="selectedId = $event"
    />

    <el-dialog v-model="previewVisible" title="表單預覽" width="600px" destroy-on-close>
      <FormRenderer :schema="{ formKey, name: formName, fields }" :preview="true" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { listForms, updateForm, parseSchema } from '@/api/form'
import FormDesigner from '@/components/FormDesigner/index.vue'
import FormRenderer from '@/components/FormRenderer/index.vue'
import type { FormField } from '@/api/types/workflow'

const route = useRoute()
const formId = route.params.id as string

const formKey = ref('')
const formName = ref('')
const fields = ref<FormField[]>([])
const selectedId = ref<string | null>(null)
const saving = ref(false)
const previewVisible = ref(false)

onMounted(async () => {
  const list = await listForms()
  const vo = list.find(f => f.id === formId)
  if (!vo) { ElMessage.error('表單不存在'); return }
  formKey.value = vo.formKey
  formName.value = vo.name
  const schema = parseSchema(vo)
  fields.value = schema.fields || []
})

async function handleSave() {
  saving.value = true
  try {
    await updateForm(formId, { formKey: formKey.value, name: formName.value, fields: fields.value })
    ElMessage.success('保存成功')
  } finally {
    saving.value = false
  }
}

function handlePreview() {
  previewVisible.value = true
}
</script>

<style scoped lang="scss">
.designer-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  background: #f5f7fa;
}
.designer-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #dcdfe6;
  flex-shrink: 0;
}
.form-title {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}
.toolbar-actions {
  display: flex;
  gap: 8px;
}
</style>
