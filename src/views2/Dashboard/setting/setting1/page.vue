<template>
  <div class="w-full flex items-start">
    <div>设置一页面</div>
    <div
      id="test-dom"
      class="w-full flex flex-wrap items-start bg-green-500 overflow-hidden"
      :class="data.changeClass"
    >
      <div class="w-50 h-50 bg-red-500"></div>
      <div class="w-50 h-50 bg-red-500"></div>
      <div class="w-50 h-50 bg-red-500"></div>
      <div class="w-50 h-50 bg-red-500"></div>
    </div>
    <div v-if="data.isShow" class="w-20 h-20" @click="tottle">展示</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue'
const data = reactive({
  isShow: true,
  changeClass: '',
})

const tottle = () => {
  if (data.changeClass === 'height220') {
    data.changeClass = 'heightAuto'
  } else {
    data.changeClass = 'height220'
  }
}

const onResize = () => {
  //会发现打印的data一直为初始值，设置为新的下次访问也是初始值
  const dom = document.querySelector('#test-dom')
  if (!dom) return
  const height = dom.getBoundingClientRect().height
  console.log(height)
  if (height > 230) {
    data.isShow = true
    data.changeClass = 'height220'
  } else {
    data.isShow = false
    data.changeClass = 'heightAuto'
  }
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.height220 {
  height: 220px;
}

.heightAuto {
  height: auto;
}

div {
  margin: 10px;
}
</style>
