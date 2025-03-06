<template>
  <div class="flex flex-col w-full h-full">
    <div>基础轮播图</div>
    <div class="bkg">
      <div class="item_container" :style="{ left: data.left }">
        <div v-for="(item, index) in data.list" class="item_view" v-bind:key="index">
          {{ item }}
        </div>
      </div>
      <div class="left_arrow" @click="onLeft"></div>
      <div class="right_arrow" @click="onRight"></div>
    </div>
    <div @click="jumpToIndex(2)">跳转到第3个</div>
  </div>
</template>

<script setup lang="ts">
import { shallowReactive } from 'vue'

const data = shallowReactive({
  list: [1, 2, 3, 4, 5, 6, 7, 8],
  index: 0,
  left: 'none',
})

const Layout = (index: number) => {
  if (index < 0 || index > data.list.length - 1) return
  data.left = `-${index * 600}px`
  data.index = index
}

const onLeft = () => {
  Layout(data.index - 1)
}

const onRight = () => {
  Layout(data.index + 1)
}

const jumpToIndex = (index: number) => {
  Layout(index)
}
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
  background-color: skyblue;
}

.item_container {
  position: absolute;
  left: 0;
  top: 0;
  min-width: 600px;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  transition: left 0.4s ease-in-out;
}

.item_view {
  width: 600px;
  height: 100%;
  font-size: 48px;
  border: 1px solid #333;
  display: flex;
  justify-content: center;
  align-items: center;
}

.arrow {
  position: absolute;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  cursor: pointer;
  display: flex;
}

.left_arrow {
  @extend .arrow;
  left: 0;
  border-right: 20px solid black;
}

.right_arrow {
  @extend .arrow;
  right: 0;
  border-left: 20px solid black;
}
</style>
