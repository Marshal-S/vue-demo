<template>
  <div class="flex flex-col">
    <div v-html="data.html"></div>

    <div>{{ shadowData.info.a }}</div>

    <div class="cursor-pointer select-none" @click="store.count++">点击改变count{{ store.count }}</div>
  </div>
</template>

<script setup lang="ts">
import store from '@/store/store'
import { inject, onMounted, onUnmounted, reactive, shallowReactive } from 'vue'

const data = reactive({
  html: '<span>啦啦啦&npsp;啦啦啦啦<span>',
})

const shadowData = shallowReactive({
  info: {
    a: '拉',
  },
  name: '啦啦啦',
})

onMounted(() => {
  console.log(typeof shadowData.info, typeof shadowData.name)
  shadowData.info.a = '啦啦啦'

  const config = inject('config')
  console.log(config)
})

onUnmounted(() => {})
</script>

<style scoped></style>
