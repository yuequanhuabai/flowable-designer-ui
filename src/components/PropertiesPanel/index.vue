<template>
  <div class="properties-panel-wrapper">
    <div class="panel-header">
      <span>屬性設置</span>
      <small class="element-type">{{ elementTypeLabel }}</small>
    </div>

    <div class="panel-body">
      <ProcessPanel
          v-if="elementType === 'Process'"
          :element="element"
          :modeler="modeler"
      />
      <StartEventPanel
          v-else-if="elementType === 'StartEvent'"
          :element="element"
          :modeler="modeler"
      />
      <UserTaskPanel
          v-else-if="elementType === 'UserTask'"
          :element="element"
          :modeler="modeler"
      />
      <SequenceFlowPanel
          v-else-if="elementType === 'SequenceFlow'"
          :element="element"
          :modeler="modeler"
      />
      <!-- EndEvent / Gateway / Task / ServiceTask 等通用面板 -->
      <CommonPanel
          v-else-if="elementType"
          :element="element"
          :modeler="modeler"
      />
      <div v-else class="empty-tip">
        選中元素查看屬性
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProcessPanel from './panels/ProcessPanel.vue'
import StartEventPanel from './panels/StartEventPanel.vue'
import UserTaskPanel from './panels/UserTaskPanel.vue'
import SequenceFlowPanel from './panels/SequenceFlowPanel.vue'
import CommonPanel from './panels/CommonPanel.vue'

const TYPE_LABEL: Record<string, string> = {
  Process: '流程',
  StartEvent: '開始事件',
  EndEvent: '結束事件',
  UserTask: '用戶任務',
  ServiceTask: '服務任務',
  ExclusiveGateway: '排他網關',
  ParallelGateway: '並行網關',
  InclusiveGateway: '包容網關',
  SequenceFlow: '順序流',
  SubProcess: '子流程',
}

const props = defineProps<{
  element: any
  modeler: any
}>()

const elementType = computed(() => {
  if (!props.element) return ''
  return props.element.type?.replace('bpmn:', '') || ''
})

const elementTypeLabel = computed(() => TYPE_LABEL[elementType.value] || elementType.value)
</script>

<style scoped lang="scss">
.properties-panel-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.panel-header {
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
}
.element-type {
  color: #909399;
  font-size: 12px;
  font-weight: normal;
}
.panel-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.empty-tip {
  text-align: center;
  color: #c0c4cc;
  padding: 40px 0;
  font-size: 13px;
}
</style>