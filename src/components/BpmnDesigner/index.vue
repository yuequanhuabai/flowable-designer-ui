<template>
  <div class="designer-container">
    <!-- 工具欄 -->
    <DesignerToolbar
        :modeler="modeler"
        @deploy="handleDeploy"
        @import="handleImport"
    />

    <!-- bpmn-js 畫布 -->
    <div ref="canvasRef" class="bpmn-canvas-container" />

    <!-- 屬性面板（右側） -->
    <PropertiesPanel
        v-if="selectedElement"
        :element="selectedElement"
        :modeler="modeler"
        class="properties-panel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { ElMessage } from 'element-plus'
import flowableModdle from './FlowableModdle.json'
import DesignerToolbar from './toolbar.vue'
import PropertiesPanel from '@/components/PropertiesPanel/index.vue'
import { deployByXml } from '@/api/process'

const canvasRef = ref<HTMLElement>()
const modeler = ref<BpmnModeler | null>(null)
const selectedElement = ref<any>(null)

// 默認空白流程 XML
const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:flowable="http://flowable.org/bpmn"
             targetNamespace="http://flowable.org/test">
  <process id="new-process" name="新建流程" isExecutable="true">
    <startEvent id="startEvent" name="開始" />
  </process>
</definitions>`

onMounted(async () => {
  modeler.value = new BpmnModeler({
    container: canvasRef.value!,
    moddleExtensions: {
      flowable: flowableModdle
    }
  })

  // 加載默認空白流程
  await modeler.value.importXML(DEFAULT_XML)

  // 監聽元素選中事件，驅動屬性面板
  const eventBus = modeler.value.get('eventBus') as any
  eventBus.on('selection.changed', ({ newSelection }: any) => {
    selectedElement.value = newSelection[0] || null
  })
})

onBeforeUnmount(() => {
  modeler.value?.destroy()
})

// 部署流程到後端
async function handleDeploy(name: string) {
  if (!modeler.value) return
  const { xml } = await modeler.value.saveXML({ format: true })
  // 從 XML 中提取 process id 作為 processKey
  const match = xml?.match(/process id="([^"]+)"/)
  const processKey = match?.[1] || 'process-' + Date.now()
  await deployByXml(name, processKey, xml!)
  ElMessage.success('流程部署成功')
}

// 導入 BPMN 文件
async function handleImport(xml: string) {
  await modeler.value?.importXML(xml)
}
</script>

<style scoped lang="scss">
.designer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
.bpmn-canvas-container {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}
.properties-panel {
  position: absolute;
  right: 0;
  top: 48px;
  width: 280px;
  height: calc(100% - 48px);
  background: #fff;
  border-left: 1px solid #dcdfe6;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 10;
}
</style>