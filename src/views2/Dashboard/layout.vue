<template>
  <div class="w-full h-dvh flex">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="w-[200px] h-full"
      :default-active="route.path"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
      @select="onSelect"
      router
    >
      <template v-for="(item, index) in allMenus" :key="index">
        <template v-if="item.children">
          <el-sub-menu :index="item.key">
            <template #title>
              <el-image v-if="item.icon" :src="item.icon" />
              <span>{{ item.name }}</span>
            </template>
            <template v-for="(subItem, idx) in item.children" :key="idx">
              <el-menu-item :index="subItem.key">{{ subItem.name }}</el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.key">
            <el-image v-if="item.icon" :src="item.icon" />
            <span class="ml-4">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { reactive } from 'vue'

const route = useRoute()

const allMenus = reactive([
  {
    key: '/dashboard/location',
    name: '首页',
    icon: new URL('@/assets/react-logo.png', import.meta.url).href,
  },
  {
    key: '/dashboard/menu',
    name: '菜单',
    icon: new URL('@/assets/react-logo.png', import.meta.url).href,
  },
  {
    key: '/dashboard/setting',
    name: '设置',
    icon: new URL('@/assets/react-logo.png', import.meta.url).href,
    children: [
      {
        key: '/dashboard/setting/setting1',
        name: '设置一',
        children: [],
      },
      {
        key: '/dashboard/setting/setting2',
        name: '设置二',
        children: [],
      },
      {
        key: '/dashboard/setting/setting3',
        name: '设置三',
        children: [],
      },
    ],
  },
])

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  console.log('query', route.query)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const onSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
span {
  margin-left: 6px;
}
</style>
