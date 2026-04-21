<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="isCollapse"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409EFF"
    router
  >
    <el-menu-item
      v-for="route in menuRoutes"
      :key="route.path"
      :index="route.path"
    >
      <el-icon>
        <component :is="route.meta?.icon" />
      </el-icon>
      <template #title>{{ route.meta?.title }}</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isCollapse = inject('isCollapse', false)

const menuRoutes = computed(() => {
  return router.getRoutes()
    .filter(r => r.meta?.title && !r.path.includes(':') && r.path !== '/')
})

const activeMenu = computed(() => route.path)
</script>
