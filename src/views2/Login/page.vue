<template>
  <div class="bkg w-dvw h-dvh flex flex-col justify-center items-center">
    <RouterLink to="/dashboard">测试RouterLink登录</RouterLink>
    <div class="cursor-pointer text-center" @click="$router.push('/dashboard')">
      测试#router登录
    </div>
    <div class="bg-green-500 w-[20px] h-[20px]"></div>
    <div class="cursor-pointer text-center" @click="goDemo">进入demo测试</div>
    <div class="cursor-pointer text-center" @click="goExcel">进入excel导入导出相关测试</div>
    <div class="flex cursor-pointer">
      <div @click="onCarouseView(0)">基础轮播图</div>
      <div style="margin-left: 20px" @click="onCarouseView(1)">无限轮播图</div>
      <div style="margin-left: 20px" @click="onCarouseView(2)">无限滚动3d轮播图</div>
    </div>
    <el-button type="primary" @click="goHome">正常登录走这是</el-button>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  localStorage.setItem('token', new Date().getTime() + '')
  router.push('/dashboard')
  // router.push({
  //   name: 'Location'
  // })
  // router.replace('/dashboard')
  // router.replace({
  //   path: '/dashboard',
  //   query: {
  //     username: 'shuai',
  //   },
  // })
}

const goDemo = () => {
  router.push('/demo')
}

const goExcel = () => {
  router.push('/uploadview')
}

const onCarouseView = (index: number) => {
  const routes = ['basecarouseview', 'carouseview', 'carouseview3d']
  router.push('/carouseview/' + routes[index])
}
</script>

<style lang="scss" scoped></style>
