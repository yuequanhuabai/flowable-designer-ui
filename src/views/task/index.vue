<template>
  <div>
    <div class="page-card search-bar">
      <el-input v-model="assignee" placeholder="查詢用戶待辦（輸入用戶名）" style="width:220px" clearable />
      <el-button type="primary" @click="fetchTasks">查詢待辦</el-button>
    </div>

    <div class="page-card">
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="taskName" label="任務名稱" min-width="140" />
        <el-table-column prop="assignee" label="辦理人" width="120" />
        <el-table-column prop="businessKey" label="業務 Key" min-width="140" />
        <el-table-column prop="createTime" label="創建時間" width="170" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="success" size="small" @click="openApproveDialog(row, 'approve')">審批通過</el-button>
            <el-button link type="danger" size="small" @click="openApproveDialog(row, 'reject')">駁回</el-button>
            <el-button link type="warning" size="small" @click="openDelegateDialog(row)">轉辦</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 審批/駁回對話框 -->
    <el-dialog v-model="approveDialog.visible" :title="approveDialog.type === 'approve' ? '審批通過' : '駁回任務'" width="420px">
      <el-form label-width="80px">
        <el-form-item label="審批意見">
          <el-input v-model="approveDialog.comment" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialog.visible = false">取消</el-button>
        <el-button :type="approveDialog.type === 'approve' ? 'primary' : 'danger'" @click="handleApprove">確認</el-button>
      </template>
    </el-dialog>

    <!-- 轉辦對話框 -->
    <el-dialog v-model="delegateDialog.visible" title="轉辦任務" width="360px">
      <el-form label-width="80px">
        <el-form-item label="轉辦給">
          <el-input v-model="delegateDialog.targetUser" placeholder="輸入用戶名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="delegateDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleDelegate">確認轉辦</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getTodoTasks, completeTask, rejectTask, delegateTask } from '@/api/task'
import type { TaskVO } from '@/api/types/workflow'

const loading = ref(false)
const assignee = ref('')
const tableData = ref<TaskVO[]>([])

const approveDialog = ref({ visible: false, task: null as TaskVO | null, type: 'approve', comment: '' })
const delegateDialog = ref({ visible: false, task: null as TaskVO | null, targetUser: '' })

async function fetchTasks() {
  if (!assignee.value) return
  loading.value = true
  try {
    tableData.value = await getTodoTasks(assignee.value)
  } finally {
    loading.value = false
  }
}

function openApproveDialog(task: TaskVO, type: 'approve' | 'reject') {
  approveDialog.value = { visible: true, task, type, comment: '' }
}

async function handleApprove() {
  const { task, type, comment } = approveDialog.value
  if (!task) return
  if (type === 'approve') {
    await completeTask({ taskId: task.taskId, comment, variables: { approved: true } })
    ElMessage.success('審批通過')
  } else {
    await rejectTask(task.taskId, comment)
    ElMessage.success('已駁回')
  }
  approveDialog.value.visible = false
  fetchTasks()
}

function openDelegateDialog(task: TaskVO) {
  delegateDialog.value = { visible: true, task, targetUser: '' }
}

async function handleDelegate() {
  const { task, targetUser } = delegateDialog.value
  if (!task || !targetUser) return
  await delegateTask(task.taskId, targetUser)
  ElMessage.success('轉辦成功')
  delegateDialog.value.visible = false
  fetchTasks()
}
</script>