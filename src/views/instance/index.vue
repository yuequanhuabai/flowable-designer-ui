<template>
  <div>
    <div class="page-card search-bar">
      <el-select v-model="queryForm.processKey" placeholder="選擇流程" clearable style="width:200px">
        <el-option
            v-for="d in definitions"
            :key="d.key"
            :label="d.name"
            :value="d.key"
        />
      </el-select>
      <el-button type="primary" @click="fetchList">查詢</el-button>
      <el-button type="success" @click="showStartDialog = true">發起流程</el-button>
    </div>

    <div class="page-card">
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="instanceId" label="實例 ID" width="180" show-overflow-tooltip />
        <el-table-column prop="processDefinitionName" label="流程名稱" min-width="140" />
        <el-table-column prop="businessKey" label="業務 Key" min-width="140" />
        <el-table-column prop="startTime" label="發起時間" width="170" />
        <el-table-column prop="suspended" label="狀態" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.suspended ? 'warning' : 'success'" size="small">
              {{ row.suspended ? '已掛起' : '運行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button v-if="!row.suspended" link type="warning" size="small" @click="handleSuspend(row)">掛起</el-button>
            <el-button v-else link type="success" size="small" @click="handleActivate(row)">激活</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">終止</el-button>
            <el-button link type="primary" size="small" @click="viewDiagram(row)">查看圖</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 發起流程對話框 -->
    <el-dialog v-model="showStartDialog" title="發起流程" width="560px" destroy-on-close>
      <el-form :model="startForm" label-width="90px">
        <el-form-item label="選擇流程" required>
          <el-select
            v-model="startForm.processKey"
            style="width:100%"
            @change="onProcessChange"
          >
            <el-option v-for="d in definitions" :key="d.key" :label="d.name" :value="d.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="業務 Key">
          <el-input v-model="startForm.businessKey" placeholder="如訂單號、請假單號" />
        </el-form-item>
      </el-form>

      <!-- 動態渲染表單字段 -->
      <div v-if="startFormSchema" style="margin-top:8px">
        <el-divider content-position="left">填寫申請信息</el-divider>
        <FormRenderer
          ref="formRendererRef"
          :schema="startFormSchema"
          v-model="startFormData"
        />
      </div>

      <template #footer>
        <el-button @click="showStartDialog = false">取消</el-button>
        <el-button type="primary" @click="handleStart">確認發起</el-button>
      </template>
    </el-dialog>

    <!-- 流程圖對話框（高亮當前節點） -->
    <el-dialog v-model="diagramDialog.visible" title="流程進度" width="900px">
      <img v-if="diagramDialog.url" :src="diagramDialog.url" style="max-width:100%" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listInstances, startProcess, suspendInstance, activateInstance, deleteInstance } from '@/api/instance'
import { listProcessDefinitions } from '@/api/process'
import { getDiagramUrl } from '@/api/history'
import { getFormByKey, parseSchema } from '@/api/form'
import FormRenderer from '@/components/FormRenderer/index.vue'
import type { ProcessDefinitionVO, ProcessInstanceVO, FormSchema } from '@/api/types/workflow'

const loading = ref(false)
const tableData = ref<ProcessInstanceVO[]>([])
const definitions = ref<ProcessDefinitionVO[]>([])
const queryForm = ref({ processKey: '' })
const showStartDialog = ref(false)
const startForm = ref({ processKey: '', businessKey: '' })
const diagramDialog = ref({ visible: false, url: '' })

const formRendererRef = ref<InstanceType<typeof FormRenderer>>()
const startFormSchema = ref<FormSchema | null>(null)
const startFormData = ref<Record<string, any>>({})

onMounted(async () => {
  definitions.value = await listProcessDefinitions()
  fetchList()
})

async function fetchList() {
  loading.value = true
  try {
    tableData.value = await listInstances(queryForm.value.processKey || undefined)
  } finally {
    loading.value = false
  }
}

async function onProcessChange(processKey: string) {
  startFormSchema.value = null
  startFormData.value = {}
  const def = definitions.value.find(d => d.key === processKey)
  if (!def?.formKey) return
  try {
    const vo = await getFormByKey(def.formKey)
    if (vo) startFormSchema.value = parseSchema(vo)
  } catch {
    // 未配置表單，靜默跳過
  }
}

async function handleStart() {
  if (formRendererRef.value) {
    const valid = await formRendererRef.value.validate()
    if (!valid) return
  }

  await startProcess({
    processKey: startForm.value.processKey,
    businessKey: startForm.value.businessKey,
    variables: { ...startFormData.value }
  })
  ElMessage.success('流程發起成功')
  showStartDialog.value = false
  fetchList()
}

async function handleSuspend(row: ProcessInstanceVO) {
  await suspendInstance(row.instanceId)
  ElMessage.success('已掛起')
  fetchList()
}

async function handleActivate(row: ProcessInstanceVO) {
  await activateInstance(row.instanceId)
  ElMessage.success('已激活')
  fetchList()
}

async function handleDelete(row: ProcessInstanceVO) {
  await ElMessageBox.confirm('確定終止此流程實例嗎？', '警告', { type: 'warning' })
  await deleteInstance(row.instanceId)
  ElMessage.success('已終止')
  fetchList()
}

function viewDiagram(row: ProcessInstanceVO) {
  diagramDialog.value = { visible: true, url: getDiagramUrl(row.instanceId) }
}
</script>
