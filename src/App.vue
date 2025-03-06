<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, provide } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

onMounted(() => {
  provide('config', {
    language: 'En',
    theme: 'dark',
  })
})
</script>

<style scoped></style>
