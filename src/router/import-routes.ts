import type { RouteRecordRaw } from 'vue-router'

type DirType = {
  path: string
  component?: unknown
  children?: DirType[]
}

const generateImportRoutes = (): RouteRecordRaw[] => {
  //webpack require.context  vite import.meta.glob
  const modules: Record<string, unknown> = import.meta.glob(
    ['@/views/**/*.vue', '@/views/**/*.tsx', '@/views/**/*.jsx'], //排除前面加上感叹号 !@/views/Dashboard/*.vue
    {
      eager: true, //默认false懒加载import，设置为false则直接导入所有
    },
  )
  //直接整理一下key、default，避免后续取出麻烦
  const comObj: Record<string, unknown> = {}
  const paths: string[][] = []
  for (const key in modules) {
    const path = key.replace(/^(\/src\/views)|(\.vue|\.tsx|\.jsx)$/g, '').toLocaleLowerCase()
    comObj[path] = (modules[key] as { default: unknown }).default
    const temPaths = path.split('/').filter((e) => e)
    paths.push(temPaths)
  }
  const structs = generateStruct(paths, comObj)
  console.log('structs', structs)
  return structs as RouteRecordRaw[]
}

//根据路径、对照表、父节点递归出我们的路由结构
const generateStruct = (
  paths: string[][],
  comObj: Record<string, unknown>,
  parent?: DirType,
): DirType[] => {
  const structs: DirType[] = []
  const map = new Map<string, string[][]>()
  for (let idx = 0; idx < paths.length; ) {
    const item = paths[idx]
    let path = parent ? item[0] : `/${item[0]}`
    if (item.length === 1) {
      if (parent) {
        path = `${parent.path}/${path}`
      }
      paths.splice(idx, 1)
      //index 当做我们的布局分发组件，对应着文件夹
      if (item[0] === 'index' && parent) {
        parent.component = comObj[path]
        continue
      }
      structs.push({
        path,
        component: comObj[path],
      })
    } else {
      const paths = map.get(path) || []
      item.splice(0, 1)
      paths.push(item)
      map.set(path, paths)
      idx++
    }
  }
  for (const [key, value] of map) {
    const obj: DirType = {
      path: parent ? `${parent.path}/${key}` : key,
    }
    obj.children = generateStruct(value, comObj, obj)
    structs.push(obj)
  }
  return structs
}

const importRoutes = generateImportRoutes()

export default importRoutes
