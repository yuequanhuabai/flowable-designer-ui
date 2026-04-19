<template>
  <div class="designer-page">
    <BpmnDesigner />
  </div>
</template>

<script setup lang="ts">
import BpmnDesigner from '@/components/BpmnDesigner/index.vue'
</script>

<style scoped lang="scss">
.designer-page {
  height: calc(100vh - 100px);
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}
</style>