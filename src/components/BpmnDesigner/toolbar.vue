<template>
  <div class="toolbar">
    <el-button-group>
      <el-button size="small" @click="handleNew">
        <el-icon><Plus /></el-icon> 新建
      </el-button>
      <el-button size="small" @click="handleImport">
        <el-icon><Upload /></el-icon> 導入
      </el-button>
      <el-button size="small" @click="handleExport">
        <el-icon><Download /></el-icon> 導出 XML
      </el-button>
      <el-button size="small" @click="handleSave">
        <el-icon><DocumentChecked /></el-icon> 保存
      </el-button>
    </el-button-group>

    <el-button-group class="ml-8">
      <el-button size="small" @click="handleZoomIn">
        <el-icon><ZoomIn /></el-icon>
      </el-button>
      <el-button size="small" @click="handleZoomOut">
        <el-icon><ZoomOut /></el-icon>
      </el-button>
      <el-button size="small" @click="handleFitView">
        <el-icon><FullScreen /></el-icon> 適應窗口
      </el-button>
    </el-button-group>

    <el-button type="primary" size="small" class="ml-8" @click="showDeployDialog = true">
      <el-icon><Promotion /></el-icon> 部署發布
    </el-button>

    <!-- 隱藏的文件輸入框 -->
    <input ref="fileInput" type="file" accept=".bpmn,.xml" hidden @change="onFileChange" />

    <!-- 部署確認對話框 -->
    <el-dialog v-model="showDeployDialog" title="部署流程" width="400px">
      <el-form :model="deployForm" label-width="80px">
        <el-form-item label="流程名稱" required>
          <el-input v-model="deployForm.name" placeholder="請輸入流程名稱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDeployDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmDeploy">確認部署</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type BpmnModeler from 'bpmn-js/lib/Modeler'

const props = defineProps<{ modeler: BpmnModeler | null }>()
const emit = defineEmits<{
  (e: 'deploy', name: string): void
  (e: 'import', xml: string): void
}>()

const fileInput = ref<HTMLInputElement>()
const showDeployDialog = ref(false)
const deployForm = ref({ name: '' })

const EMPTY_XML = `<?xml version="1.0" encoding="UTF-8"?>
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

function handleNew() {
  props.modeler?.importXML(EMPTY_XML)
}

function handleImport() {
  fileInput.value?.click()
}

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const xml = await file.text()
  emit('import', xml)
}

async function handleExport() {
  const { xml } = await props.modeler!.saveXML({ format: true })
  const blob = new Blob([xml!], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'process.bpmn20.xml'
  a.click()
  URL.revokeObjectURL(url)
}

async function handleSave() {
  const { xml } = await props.modeler!.saveXML({ format: true })
  console.log('當前 BPMN XML：', xml)
}

function handleZoomIn() {
  const zoom = props.modeler?.get('zoomScroll') as any
  zoom?.zoom(0.2)
}

function handleZoomOut() {
  const zoom = props.modeler?.get('zoomScroll') as any
  zoom?.zoom(-0.2)
}

function handleFitView() {
  const canvas = props.modeler?.get('canvas') as any
  canvas?.zoom('fit-viewport')
}

function confirmDeploy() {
  if (!deployForm.value.name) return
  emit('deploy', deployForm.value.name)
  showDeployDialog.value = false
  deployForm.value.name = ''
}
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border-bottom: 1px solid #dcdfe6;
  flex-wrap: wrap;
}
.ml-8 { margin-left: 8px; }
</style>