<template>
  <div class="designer-container">
    <DesignerToolbar
        :modeler="modeler"
        :draft-name="draftName"
        @save="handleSave"
        @deploy="handleDeploy"
        @import="handleImport"
    />
    <div ref="canvasRef" class="bpmn-canvas-container" />
    <PropertiesPanel
        v-if="selectedElement"
        :element="selectedElement"
        :modeler="modeler"
        class="properties-panel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, markRaw, onMounted, onBeforeUnmount, watch } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import flowableModdle from './FlowableModdle.json'
import DesignerToolbar from './toolbar.vue'
import PropertiesPanel from '@/components/PropertiesPanel/index.vue'

const props = defineProps<{
  initialXml?: string
  draftName?: string
}>()

const emit = defineEmits<{
  (e: 'save', xml: string): void
  (e: 'deploy', payload: { name: string; xml: string }): void
}>()

const canvasRef = ref<HTMLElement>()
const modeler = shallowRef<BpmnModeler | null>(null)
const selectedElement = shallowRef<any>(null)

const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:flowable="http://flowable.org/bpmn"
             targetNamespace="http://flowable.org/test">
  <process id="Process_1" name="新建流程" isExecutable="true" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</definitions>`

onMounted(async () => {
  modeler.value = markRaw(new BpmnModeler({
    container: canvasRef.value!,
    moddleExtensions: { flowable: flowableModdle }
  }))

  await modeler.value.importXML(props.initialXml || DEFAULT_XML)

  const eventBus = modeler.value.get('eventBus') as any
  eventBus.on('selection.changed', ({ newSelection }: any) => {
    selectedElement.value = newSelection[0] || null
  })
})

// 父組件異步加載完 initialXml 後重新導入
watch(() => props.initialXml, async (xml) => {
  if (xml && modeler.value) {
    await modeler.value.importXML(xml)
  }
})

onBeforeUnmount(() => {
  modeler.value?.destroy()
})

async function handleSave() {
  if (!modeler.value) return
  const { xml } = await modeler.value.saveXML({ format: true })
  emit('save', xml!)
}

async function handleDeploy(name: string) {
  if (!modeler.value) return
  const { xml } = await modeler.value.saveXML({ format: true })
  emit('deploy', { name, xml: xml! })
}

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
