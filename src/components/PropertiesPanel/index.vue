<template>
  <div class="properties-panel-wrapper">
    <div class="panel-header">
      <span>屬性設置</span>
      <small class="element-type">{{ elementType }}</small>
    </div>

    <div class="panel-body">
      <!-- 根據元素類型展示不同面板 -->
      <ProcessPanel
          v-if="elementType === 'Process'"
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
      <div v-else class="empty-tip">
        選中元素查看屬性
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProcessPanel from './panels/ProcessPanel.vue'
import UserTaskPanel from './panels/UserTaskPanel.vue'
import SequenceFlowPanel from './panels/SequenceFlowPanel.vue'

const props = defineProps<{
  element: any
  modeler: any
}>()

const elementType = computed(() => {
  if (!props.element) return ''
  return props.element.type?.replace('bpmn:', '') || ''
})
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