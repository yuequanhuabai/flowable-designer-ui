<template>
  <div class="config-panel">
    <div class="panel-title">字段屬性</div>

    <div v-if="!field" class="empty-tip">點擊畫布中的字段進行配置</div>

    <el-form v-else :model="form" label-width="75px" size="small" class="config-form">
      <el-form-item label="字段變量">
        <el-input v-model="form.field" placeholder="如：reason" @input="update" />
        <div class="tip">提交時的數據 key</div>
      </el-form-item>
      <el-form-item label="顯示名稱">
        <el-input v-model="form.label" placeholder="如：請假原因" @input="update" />
      </el-form-item>
      <el-form-item label="必填">
        <el-switch v-model="form.required" @change="update" />
      </el-form-item>
      <el-form-item v-if="hasPlaceholder" label="提示文字">
        <el-input v-model="form.placeholder" @input="update" />
      </el-form-item>
      <el-form-item v-if="hasDefault" label="默認值">
        <el-input v-model="form.defaultValue" @input="update" />
      </el-form-item>

      <template v-if="form.type === 'number'">
        <el-form-item label="最小值">
          <el-input-number v-model="form.min" :controls="false" @change="update" style="width:100%" />
        </el-form-item>
        <el-form-item label="最大值">
          <el-input-number v-model="form.max" :controls="false" @change="update" style="width:100%" />
        </el-form-item>
      </template>

      <el-form-item v-if="form.type === 'date'" label="日期格式">
        <el-select v-model="form.dateFormat" @change="update">
          <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
          <el-option label="YYYY-MM-DD HH:mm" value="YYYY-MM-DD HH:mm" />
        </el-select>
      </el-form-item>

      <template v-if="hasOptions">
        <el-divider content-position="left">選項配置</el-divider>
        <div v-for="(opt, i) in form.options" :key="i" class="option-row">
          <el-input v-model="opt.label" placeholder="顯示文字" size="small" @input="update" />
          <el-input v-model="opt.value" placeholder="值"       size="small" @input="update" />
          <el-icon class="del-opt" @click="removeOption(i)"><Minus /></el-icon>
        </div>
        <el-button size="small" @click="addOption">+ 添加選項</el-button>
      </template>

      <template v-if="form.type === 'upload'">
        <el-form-item label="接受類型">
          <el-input v-model="form.accept" placeholder="如：.pdf,.jpg" @input="update" />
        </el-form-item>
        <el-form-item label="大小限制(MB)">
          <el-input-number v-model="form.maxSize" :min="1" :controls="false" @change="update" style="width:100%" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { FormField } from '@/api/types/workflow'

const props = defineProps<{ field: FormField | null }>()
const emit = defineEmits<{ (e: 'update', v: FormField): void }>()

const form = reactive<Partial<FormField>>({})

watch(() => props.field, (f) => {
  if (!f) return
  Object.assign(form, JSON.parse(JSON.stringify(f)))
}, { immediate: true, deep: true })

const hasPlaceholder = computed(() => ['input', 'textarea', 'number'].includes(form.type || ''))
const hasDefault     = computed(() => ['input', 'number'].includes(form.type || ''))
const hasOptions     = computed(() => ['select', 'radio', 'checkbox'].includes(form.type || ''))

function update() {
  if (!props.field) return
  emit('update', { ...props.field, ...form } as FormField)
}

function addOption() {
  if (!form.options) form.options = []
  form.options.push({ label: `選項${form.options.length + 1}`, value: `option${form.options.length + 1}` })
  update()
}

function removeOption(i: number) {
  form.options?.splice(i, 1)
  update()
}
</script>

<style scoped lang="scss">
.config-panel { height: 100%; overflow-y: auto; }
.panel-title {
  padding: 12px 16px;
  font-weight: bold;
  font-size: 13px;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
}
.empty-tip {
  text-align: center;
  color: #c0c4cc;
  padding: 40px 16px;
  font-size: 12px;
}
.config-form { padding: 12px; }
.option-row {
  display: flex;
  gap: 4px;
  align-items: center;
  margin-bottom: 6px;
}
.del-opt { cursor: pointer; color: #f56c6c; flex-shrink: 0; }
.tip { font-size: 11px; color: #909399; margin-top: 3px; }
</style>
