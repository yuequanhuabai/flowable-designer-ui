<template>
  <div class="editor-page">
    <BpmnDesigner
      :initial-xml="initialXml"
      :draft-name="draftName"
      @save="handleSave"
      @deploy="handleDeploy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getDraft, updateDraft } from '@/api/draft'
import { deployByXml } from '@/api/process'
import BpmnDesigner from '@/components/BpmnDesigner/index.vue'

const route = useRoute()
const router = useRouter()
const draftId = route.params.id as string

const initialXml = ref('')
const draftName = ref('')
const processKey = ref('')

onMounted(async () => {
  const vo = await getDraft(draftId)
  if (!vo) { ElMessage.error('草稿不存在'); router.push('/designer'); return }
  initialXml.value = vo.bpmnXml
  draftName.value = vo.name
  processKey.value = vo.processKey
})

async function handleSave(xml: string) {
  await updateDraft(draftId, { name: draftName.value, processKey: processKey.value, bpmnXml: xml })
  ElMessage.success('草稿已保存')
}

async function handleDeploy(payload: { name: string; xml: string }) {
  // 同步保存最新 XML 再部署
  await updateDraft(draftId, { name: payload.name, processKey: processKey.value, bpmnXml: payload.xml })
  await deployByXml(payload.name, processKey.value, payload.xml)
  ElMessage.success('部署成功')
}
</script>

<style scoped lang="scss">
.editor-page {
  height: calc(100vh - 100px);
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}
</style>
