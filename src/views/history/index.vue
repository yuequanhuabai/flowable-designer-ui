<template>
  <div>
    <div class="page-card search-bar">
      <el-input v-model="searchKey" placeholder="流程 Key" style="width:200px" clearable />
      <el-button type="primary" @click="fetchHistory">查詢</el-button>
    </div>

    <div class="page-card">
      <el-table :data="tableData" border stripe v-loading="loading" @row-click="viewDetail">
        <el-table-column prop="processDefinitionName" label="流程名稱" min-width="140" />
        <el-table-column prop="businessKey" label="業務 Key" min-width="140" />
        <el-table-column prop="startUserId" label="發起人" width="120" />
        <el-table-column prop="startTime" label="發起時間" width="170" />
        <el-table-column prop="endTime" label="結束時間" width="170" />
        <el-table-column label="耗時" width="100">
          <template #default="{ row }">
            {{ row.duration ? Math.round(row.duration / 1000) + 's' : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click.stop="viewDetail(row)">查看記錄</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 審批記錄 + 流程圖對話框 -->
    <el-dialog v-model="detailDialog.visible" title="流程詳情" width="800px">
      <el-tabs>
        <el-tab-pane label="審批記錄">
          <el-timeline>
            <el-timeline-item
                v-for="item in detailDialog.activities"
                :key="item.activityId"
                :timestamp="item.startTime"
                :type="item.activityType === 'userTask' ? 'primary' : 'info'"
            >
              <div>
                <strong>{{ item.activityName || item.activityId }}</strong>
                <span v-if="item.assignee" class="ml-8 text-gray">辦理人：{{ item.assignee }}</span>
              </div>
              <div v-if="item.endTime" class="text-gray text-sm">結束：{{ item.endTime }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>

        <el-tab-pane label="流程圖高亮">
          <!-- Step 22：調用後端圖片接口 -->
          <img
              v-if="detailDialog.instanceId"
              :src="`/workflow/api/history/diagram/${detailDialog.instanceId}`"
              style="max-width:100%;border:1px solid #eee;border-radius:4px"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { listFinishedInstances, getActivities } from '@/api/history'

const loading = ref(false)
const searchKey = ref('')
const tableData = ref<any[]>([])
const detailDialog = ref({ visible: false, instanceId: '', activities: [] as any[] })

async function fetchHistory() {
  loading.value = true
  try {
    tableData.value = await listFinishedInstances(searchKey.value || undefined)
  } finally {
    loading.value = false
  }
}

async function viewDetail(row: any) {
  const activities = await getActivities(row.instanceId)
  detailDialog.value = { visible: true, instanceId: row.instanceId, activities }
}
</script>

<style scoped lang="scss">
.ml-8 { margin-left: 8px; }
.text-gray { color: #909399; }
.text-sm { font-size: 12px; }
</style>