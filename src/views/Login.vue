<template>
  <div class="w-dvw h-dvh flex justify-center items-center">
    <div class="flex-col">
      <RouterLink to="/dashboard">测试RouterLink登录</RouterLink>
      <div class="cursor-pointer text-center" @click="$router.push('/dashboard')">
        测试#router登录
      </div>

      <div class="cursor-pointer text-center" @click="goDemo">进入demo测试</div>

      <el-button type="primary" @click="goHome">正常登录走这是</el-button>
    </div>
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
</script>

<style scoped></style>
