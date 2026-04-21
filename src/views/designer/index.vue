<template>
  <div>
    <div class="page-card search-bar">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon> 新建流程
      </el-button>
    </div>

    <div class="page-card">
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="name" label="流程名稱" min-width="160" />
        <el-table-column prop="processKey" label="流程 Key" min-width="160" />
        <el-table-column prop="updateTime" label="最後保存" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">編輯</el-button>
            <el-button link type="success" size="small" @click="handleDeploy(row)">部署發布</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新建對話框 -->
    <el-dialog v-model="createDialog.visible" title="新建流程草稿" width="400px">
      <el-form :model="createDialog.form" label-width="80px">
        <el-form-item label="流程名稱" required>
          <el-input v-model="createDialog.form.name" placeholder="如：請假申請流程" />
        </el-form-item>
        <el-form-item label="流程 Key" required>
          <el-input v-model="createDialog.form.processKey" placeholder="如：leave-apply（英文）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="createDialog.loading" @click="confirmCreate">確認</el-button>
      </template>
    </el-dialog>

    <!-- 部署對話框 -->
    <el-dialog v-model="deployDialog.visible" title="部署流程" width="400px">
      <el-form :model="deployDialog.form" label-width="80px">
        <el-form-item label="部署名稱" required>
          <el-input v-model="deployDialog.form.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="deployDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="deployDialog.loading" @click="confirmDeploy">確認部署</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listDrafts, createDraft, deleteDraft } from '@/api/draft'
import { deployByXml } from '@/api/process'
import type { ProcessDraftVO } from '@/api/types/workflow'

const router = useRouter()
const loading = ref(false)
const tableData = ref<ProcessDraftVO[]>([])

const createDialog = reactive({
  visible: false,
  loading: false,
  form: { name: '', processKey: '' }
})

const deployDialog = reactive({
  visible: false,
  loading: false,
  form: { name: '' },
  draft: null as ProcessDraftVO | null
})

onMounted(fetchList)

async function fetchList() {
  loading.value = true
  try {
    tableData.value = await listDrafts()
  } catch {
    // 後端未就緒時靜默跳過，不讓頁面崩潰
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  createDialog.form = { name: '', processKey: '' }
  createDialog.visible = true
}

async function confirmCreate() {
  if (!createDialog.form.name || !createDialog.form.processKey) {
    ElMessage.warning('請填寫流程名稱和流程 Key')
    return
  }
  createDialog.loading = true
  try {
    const EMPTY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:flowable="http://flowable.org/bpmn"
             targetNamespace="http://flowable.org/test">
  <process id="${createDialog.form.processKey}" name="${createDialog.form.name}" isExecutable="true" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${createDialog.form.processKey}" />
  </bpmndi:BPMNDiagram>
</definitions>`
    const vo = await createDraft({
      name: createDialog.form.name,
      processKey: createDialog.form.processKey,
      bpmnXml: EMPTY_XML
    })
    createDialog.visible = false
    router.push(`/designer/editor/${vo.id}`)
  } finally {
    createDialog.loading = false
  }
}

function handleEdit(row: ProcessDraftVO) {
  router.push(`/designer/editor/${row.id}`)
}

function handleDeploy(row: ProcessDraftVO) {
  deployDialog.draft = row
  deployDialog.form.name = row.name
  deployDialog.visible = true
}

async function confirmDeploy() {
  if (!deployDialog.draft) return
  deployDialog.loading = true
  try {
    await deployByXml(deployDialog.form.name, deployDialog.draft.processKey, deployDialog.draft.bpmnXml)
    ElMessage.success('部署成功')
    deployDialog.visible = false
  } finally {
    deployDialog.loading = false
  }
}

async function handleDelete(row: ProcessDraftVO) {
  await ElMessageBox.confirm(`確定刪除草稿「${row.name}」？`, '提示', { type: 'warning' })
  await deleteDraft(row.id)
  ElMessage.success('已刪除')
  fetchList()
}
</script>
