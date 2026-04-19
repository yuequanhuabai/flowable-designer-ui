<template>
  <el-container class="app-wrapper">
    <!-- 左側菜單 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <span v-if="!isCollapse">流程引擎</span>
        <span v-else>FE</span>
      </div>
      <Sidebar />
    </el-aside>

    <!-- 右側主區域 -->
    <el-container>
      <!-- 頂部導航 -->
      <el-header class="navbar">
        <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>{{ currentRoute?.meta?.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>

      <!-- 主內容區 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const isCollapse = ref(false)
const currentRoute = useRoute()
</script>

<style scoped lang="scss">
.app-wrapper {
  height: 100vh;
}
.sidebar {
  background: #304156;
  transition: width 0.3s;
  overflow: hidden;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background: #2b3a4e;
  overflow: hidden;
  white-space: nowrap;
}
.navbar {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 0 16px;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}
.main-content {
  background: #f5f7fa;
  padding: 16px;
}
</style>
