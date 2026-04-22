<template>
  <div>
    <!-- bpmn:Task 時提示轉換 -->
    <el-alert
      v-if="isPlainTask"
      title="當前為普通任務，建議轉換為「用戶任務」以支持 Flowable 分配屬性"
      type="warning"
      :closable="false"
      style="margin-bottom:12px"
    >
      <el-button size="small" type="primary" style="margin-top:6px" @click="convertToUserTask">
        一鍵轉為用戶任務
      </el-button>
    </el-alert>

  <el-form :model="form" label-width="90px" size="small">

    <el-form-item label="任務名稱">
      <el-input v-model="form.name" @change="updateProperty('name', form.name)" />
    </el-form-item>

    <el-form-item label="元素 ID">
      <el-input v-model="form.id" @change="updateProperty('id', form.id)" />
    </el-form-item>

    <el-divider content-position="left">辦理人配置</el-divider>

    <!-- 分配方式選擇 -->
    <el-form-item label="分配方式">
      <el-radio-group v-model="form.assignType" @change="onAssignTypeChange">
        <el-radio value="assignee">指定用戶</el-radio>
        <el-radio value="candidateUsers">候選用戶</el-radio>
        <el-radio value="candidateGroups">候選角色</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 指定用戶 -->
    <el-form-item v-if="form.assignType === 'assignee'" label="辦理人">
      <el-select
        v-if="hrUsersAvailable"
        v-model="form.assignee"
        filterable
        clearable
        placeholder="選擇用戶"
        style="width:100%"
        @change="updateFlowableProperty('assignee', form.assignee)"
      >
        <el-option
          v-for="u in hrUsers"
          :key="u.username"
          :label="`${u.nickname}（${u.username}）`"
          :value="u.username"
        />
      </el-select>
      <el-input
        v-else
        v-model="form.assignee"
        placeholder="用戶名 或 ${變量名}"
        @change="updateFlowableProperty('assignee', form.assignee)"
      />
      <div class="tip">固定用戶：zhangsan　　流程變量：${approver1}</div>
    </el-form-item>

    <!-- 候選用戶（多人搶佔） -->
    <el-form-item v-if="form.assignType === 'candidateUsers'" label="候選用戶">
      <el-select
        v-if="hrUsersAvailable"
        v-model="candidateUsersArr"
        multiple
        filterable
        clearable
        placeholder="選擇候選用戶"
        style="width:100%"
        @change="onCandidateUsersChange"
      >
        <el-option
          v-for="u in hrUsers"
          :key="u.username"
          :label="`${u.nickname}（${u.username}）`"
          :value="u.username"
        />
      </el-select>
      <el-input
        v-else
        v-model="form.candidateUsers"
        placeholder="多個用逗號分隔：user1,user2"
        @change="updateFlowableProperty('candidateUsers', form.candidateUsers)"
      />
      <div class="tip">候選用戶中任意一人認領後即可辦理</div>
    </el-form-item>

    <!-- 候選角色（按角色/組分配） -->
    <el-form-item v-if="form.assignType === 'candidateGroups'" label="角色/組">
      <el-select
        v-if="hrRolesAvailable"
        v-model="candidateGroupsArr"
        multiple
        filterable
        clearable
        placeholder="選擇候選角色"
        style="width:100%"
        @change="onCandidateGroupsChange"
      >
        <el-option
          v-for="r in hrRoles"
          :key="r.roleKey"
          :label="`${r.roleName}（${r.roleKey}）`"
          :value="r.roleKey"
        />
      </el-select>
      <el-input
        v-else
        v-model="form.candidateGroups"
        placeholder="多個用逗號分隔：role1,role2"
        @change="updateFlowableProperty('candidateGroups', form.candidateGroups)"
      />
      <div class="tip">該角色下任意成員可認領辦理</div>
    </el-form-item>

    <el-divider content-position="left">其他配置</el-divider>

    <el-form-item label="表單 Key">
      <el-input
        v-model="form.formKey"
        placeholder="如：leave-form"
        @change="updateFlowableProperty('formKey', form.formKey)"
      />
      <div class="tip">對應前端表單頁面的唯一標識</div>
    </el-form-item>

    <el-form-item label="到期時間">
      <el-input
        v-model="form.dueDate"
        placeholder="如：${dueDate} 或 P3D（3天後）"
        @change="updateFlowableProperty('dueDate', form.dueDate)"
      />
    </el-form-item>

    <el-form-item label="優先級">
      <el-select v-model="form.priority" @change="updateFlowableProperty('priority', form.priority)">
        <el-option label="低 (0)" value="0" />
        <el-option label="普通 (50)" value="50" />
        <el-option label="高 (100)" value="100" />
      </el-select>
    </el-form-item>

  </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch, ref, onMounted } from 'vue'
import { listHrUsers, listHrRoles, type HrUser, type HrRole } from '@/api/hrUser'

const props = defineProps<{ element: any; modeler: any }>()

const isPlainTask = computed(() => props.element?.type === 'bpmn:Task')

function convertToUserTask() {
  const bpmnReplace = props.modeler?.get('bpmnReplace')
  if (!bpmnReplace) return
  bpmnReplace.replaceElement(props.element, { type: 'bpmn:UserTask' })
}

const hrUsers = ref<HrUser[]>([])
const hrRoles = ref<HrRole[]>([])
const hrUsersAvailable = ref(false)
const hrRolesAvailable = ref(false)

onMounted(async () => {
  try {
    hrUsers.value = await listHrUsers()
    hrUsersAvailable.value = hrUsers.value.length > 0
  } catch { /* HR 系統不可用，降級文本輸入 */ }
  try {
    hrRoles.value = await listHrRoles()
    hrRolesAvailable.value = hrRoles.value.length > 0
  } catch { /* HR 系統不可用，降級文本輸入 */ }
})

const form = reactive({
  id: '',
  name: '',
  assignType: 'assignee' as 'assignee' | 'candidateUsers' | 'candidateGroups',
  assignee: '',
  candidateUsers: '',
  candidateGroups: '',
  formKey: '',
  dueDate: '',
  priority: '50'
})

// 多選拆分/合並輔助
const candidateUsersArr = computed({
  get: () => form.candidateUsers ? form.candidateUsers.split(',').map(s => s.trim()).filter(Boolean) : [],
  set: (v: string[]) => { form.candidateUsers = v.join(',') }
})
const candidateGroupsArr = computed({
  get: () => form.candidateGroups ? form.candidateGroups.split(',').map(s => s.trim()).filter(Boolean) : [],
  set: (v: string[]) => { form.candidateGroups = v.join(',') }
})

function onCandidateUsersChange() {
  updateFlowableProperty('candidateUsers', form.candidateUsers)
}
function onCandidateGroupsChange() {
  updateFlowableProperty('candidateGroups', form.candidateGroups)
}

watch(() => props.element, (el) => {
  if (!el) return
  const bo = el.businessObject
  form.id = bo?.id || ''
  form.name = bo?.name || ''
  form.assignee = bo?.assignee || ''
  form.candidateUsers = bo?.candidateUsers || ''
  form.candidateGroups = bo?.candidateGroups || ''
  form.formKey = bo?.formKey || ''
  form.dueDate = bo?.dueDate || ''
  form.priority = bo?.priority || '50'

  if (bo?.candidateGroups) {
    form.assignType = 'candidateGroups'
  } else if (bo?.candidateUsers) {
    form.assignType = 'candidateUsers'
  } else {
    form.assignType = 'assignee'
  }
}, { immediate: true })

function onAssignTypeChange() {
  const modeling = props.modeler?.get('modeling')
  if (!modeling) return
  modeling.updateProperties(props.element, {
    assignee: undefined,
    candidateUsers: undefined,
    candidateGroups: undefined
  })
  form.assignee = ''
  form.candidateUsers = ''
  form.candidateGroups = ''
}

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
