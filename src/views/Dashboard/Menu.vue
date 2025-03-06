<template>
  <div>我是Menu或者subMenu，参数是 {{ $route.query.id }}</div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.params.id,
  (id) => {
    //路由参数改变后立即回调
    console.log(id)
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>


</style>
