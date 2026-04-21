<template>
  <div>
    <div class="page-card search-bar">
      <el-input
        v-model="searchKey"
        placeholder="搜索表單名稱/Key"
        style="width:240px"
        clearable
        @keyup.enter="fetchList"
      />
      <el-button type="primary" @click="fetchList">查詢</el-button>
      <el-button type="success" @click="showCreateDialog = true">+ 新建表單</el-button>
    </div>

    <div class="page-card">
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="name"       label="表單名稱" min-width="160" />
        <el-table-column prop="formKey"    label="表單 Key" min-width="160" />
        <el-table-column prop="version"    label="版本"     width="70" align="center">
          <template #default="{ row }">
            <el-tag size="small">v{{ row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最後更新" width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="goDesign(row)">設計</el-button>
            <el-button link type="danger"  size="small" @click="handleDelete(row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="showCreateDialog" title="新建表單" width="420px">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="表單名稱" required>
          <el-input v-model="createForm.name" placeholder="如：請假申請表" />
        </el-form-item>
        <el-form-item label="表單 Key" required>
          <el-input v-model="createForm.formKey" placeholder="如：leave-apply（英文）" />
          <div style="font-size:11px;color:#909399;margin-top:4px">
            唯一標識，與流程節點 formKey 對應，創建後不可修改
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">確認創建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listForms, createForm as createFormApi, deleteForm } from '@/api/form'
import type { FormDefinitionVO } from '@/api/types/workflow'

const router = useRouter()
const loading = ref(false)
const searchKey = ref('')
const tableData = ref<FormDefinitionVO[]>([])
const showCreateDialog = ref(false)
const createForm = ref({ name: '', formKey: '' })

onMounted(fetchList)

async function fetchList() {
  loading.value = true
  try {
    const list = await listForms()
    tableData.value = searchKey.value
      ? list.filter(f => f.name.includes(searchKey.value) || f.formKey.includes(searchKey.value))
      : list
  } finally {
    loading.value = false
  }
}

function goDesign(row: FormDefinitionVO) {
  router.push(`/form/designer/${row.id}`)
}

async function handleCreate() {
  if (!createForm.value.name || !createForm.value.formKey) {
    ElMessage.warning('名稱和 Key 不能為空')
    return
  }
  await createFormApi(createForm.value)
  ElMessage.success('創建成功')
  showCreateDialog.value = false
  createForm.value = { name: '', formKey: '' }
  fetchList()
}

async function handleDelete(row: FormDefinitionVO) {
  await ElMessageBox.confirm(`確定刪除表單「${row.name}」嗎？`, '警告', { type: 'warning' })
  await deleteForm(row.id)
  ElMessage.success('刪除成功')
  fetchList()
}
</script>
