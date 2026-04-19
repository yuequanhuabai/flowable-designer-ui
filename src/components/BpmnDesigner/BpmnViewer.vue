<template>
  <div ref="viewerRef" class="bpmn-viewer-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import BpmnNavigatedViewer from 'bpmn-js/lib/NavigatedViewer'

const props = defineProps<{ xml: string }>()
const viewerRef = ref<HTMLElement>()
let viewer: BpmnNavigatedViewer | null = null

onMounted(() => {
  viewer = new BpmnNavigatedViewer({ container: viewerRef.value! })
  loadXml(props.xml)
})

watch(() => props.xml, (xml) => {
  loadXml(xml)
})

async function loadXml(xml: string) {
  if (!xml || !viewer) return
  await viewer.importXML(xml)
  const canvas = viewer.get('canvas') as any
  canvas.zoom('fit-viewport')
}

onBeforeUnmount(() => {
  viewer?.destroy()
})
</script>

<style scoped lang="scss">
.bpmn-viewer-container {
  width: 100%;
  height: 500px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>