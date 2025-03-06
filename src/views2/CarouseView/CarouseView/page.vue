<template>
  <div class="flex flex-col w-full h-full">
    <div>无限轮播图</div>
    <div class="bkg">
      <div
        v-for="(item, index) in data.list"
        class="item_view"
        :class="{
          is_active: data.activeIndex.includes(index),
        }"
        :style="{ transform: data.transforms[index] }"
        v-bind:key="index"
      >
        <div class="flex w-full h-full justify-center items-center">{{ item }}</div>
      </div>
      <div class="left_arrow" @click="onLeft"></div>
      <div class="right_arrow" @click="onRight"></div>
    </div>
    <div @click="jumpToIndex(2)">跳转到第3个</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowReactive } from 'vue'

const timeout = ref<number>()

const data = shallowReactive<{
  list: unknown[]
  index: number
  activeIndex: number[]
  transforms: string[]
}>({
  list: [1, 2, 3, 4, 5, 6, 7, 8],
  index: -1,
  activeIndex: [0],
  transforms: [],
})

const throttle = (fn: () => void) => {
  if (timeout.value !== undefined) return
  fn()
  timeout.value = setTimeout(() => {
    timeout.value = undefined
  }, 400)
}

const onLayout = (current: number) => {
  let len = data.list.length
  if (len < 2) {
    return
  } else if (len === 2) {
    data.list = data.list.concat(data.list)
    len = 4
  }
  const pre = (current - 1 + len) % len
  current = (current + len) % len
  const next = (current + 1 + len) % len
  const transform: string[] = []
  for (let idx = 0; idx < len; idx++) {
    let index = idx
    if (idx === pre) {
      index = -1
    } else if (idx === current) {
      index = 0
    } else if (idx === next) {
      index = 1
    } else {
      index = idx - current
    }
    transform.push(`translateX(${index * 100}%)`)
  }
  data.activeIndex = data.index >= 0 ? [current, data.index] : [current]
  data.transforms = transform
  data.index = current
}

const onLeft = () => {
  throttle(() => onLayout(data.index - 1))
}

const onRight = () => {
  throttle(() => onLayout(data.index + 1))
}

const jumpToIndex = (index: number) => {
  throttle(() => onLayout(index))
}

onMounted(() => {
  onLayout(0)
})
</script>

<style lang="scss" scoped>
.bkg {
  border: 1px solid #333;
  margin: 0 20px;
  display: flex;
  width: 600px;
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  z-index: 0;
}

.item_view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-size: 48px;
  border: 1px solid #333;
  background-color: skyblue;
  z-index: 0;
  transition: transform 0.4s ease-in-out;
}

.is_active {
  z-index: 1;
}

.base_arrow {
  position: absolute;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  cursor: pointer;
}

.left_arrow {
  @extend .base_arrow;
  left: 0;
  border-right: 20px solid black;
  z-index: 2;
}

.right_arrow {
  @extend .base_arrow;
  right: 0;
  border-left: 20px solid black;
  z-index: 2;
}
</style>
