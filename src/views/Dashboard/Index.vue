<template>
  <div class="w-full h-dvh flex">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="w-[200px] h-full"
      default-active="/dashboard/location"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
      @select="onSelect"
      router
    >
      <el-menu-item index="/dashboard/location">
        <el-icon><location /></el-icon>
        <span>首页</span>
      </el-menu-item>

      <el-sub-menu index="/dashboard/menu">
        <template #title>
          <el-icon><icon-menu /></el-icon>
          <span>菜单</span>
        </template>
        <el-menu-item index="/dashboard/menu?id=1">页面一</el-menu-item>
        <el-menu-item index="/dashboard/menu?id=2">页面二</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/dashboard/setting/setting1">
        <el-icon><setting /></el-icon>
        <span>设置</span>
      </el-menu-item>
    </el-menu>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  console.log('query', route.query)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const onSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style lang="scss" scoped></style>
