<template>
  <div class="flex flex-col w-full h-full">
    <div>无限滚动3d轮播图</div>
    <div class="bkg">
      <div class="item_container">
        <div
          v-for="(item, index) in data.list"
          class="item_view"
          :class="{
            is_active: data.activeIndex === index,
          }"
          :style="{ transform: data.transforms[index], opacity: data.opacitys[index] }"
          v-bind:key="index"
        >
          <div class="flex w-full h-full justify-center items-center">{{ item }}</div>
        </div>
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
  activeIndex: number
  transforms: string[]
  opacitys: string[]
}>({
  list: [1, 2, 3, 4, 5, 6, 7, 8],
  index: -1,
  activeIndex: 0,
  transforms: [],
  opacitys: [],
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
  } else if (len < 5) {
    const list = [...data.list]
    for (let idx = len; idx < 5; idx += len) {
      data.list.push(...list)
    }
    len = data.list.length
  }
  const prepre = (current - 2 + len) % len
  const pre = (current - 1 + len) % len
  current = (current + len) % len
  const next = (current + 1 + len) % len
  const nextnext = (current + 2 + len) % len
  const transforms: string[] = []
  const opacitys: string[] = []
  for (let idx = 0; idx < len; idx++) {
    const index = idx
    let transform = ''
    let opacity = '0'
    if (index === prepre) {
      transform = `translateX(-100%) scale(0.6)`
      opacity = '0'
    } else if (idx === pre) {
      transform = `translateX(-60%) scale(0.8)`
      opacity = '0.7'
    } else if (idx === current) {
      transform = `translateX(0) scale(1)`
      opacity = '1'
    } else if (idx === next) {
      transform = `translateX(60%) scale(0.8)`
      opacity = '0.7'
    } else if (idx === nextnext) {
      transform = `translateX(100%) scale(0.6)`
      opacity = '0'
    } else {
      transform = `translateX(${(idx - current) * 100}%)`
      opacity = '0'
    }
    transforms.push(transform)
    opacitys.push(opacity)
  }
  data.activeIndex = current
  data.transforms = transforms
  data.opacitys = opacitys
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
}

.item_container {
  position: absolute;
  left: 20%;
  top: 20%;
  width: 60%;
  height: 60%;
  display: flex;
  flex-wrap: nowrap;
  transform: skew();
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
  transition: all 0.4s ease-in-out;
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
