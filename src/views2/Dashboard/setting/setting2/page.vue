<template>
  <div class="w-full flex flex-col">
    <div class="w-full">{{ data.title }}</div>
    <div class="w-full">{{ data.content }}</div>
    <div class="w-full">数量{{ data.count }}</div>
    <div class="cursor-pointer select-none" @click="addCount">点击增加数量</div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const data = reactive({
  title: '我是设置页面二',
  content: '一个点击增加案例',
  count: 0,
})

const addCount = () => {
  data.count++
}
</script>

<style scoped></style>
