<template>
  <div class="flex flex-col">
    <div>导入导出相关</div>
    <div class="flex">
      <input type="file" :onChange="onRead" />
      <div>导入单表头数据</div>
    </div>
    <div class="cursor-pointer" @click="onExport">导出单表头数据</div>

    <div class="flex">
      <input type="file" :onChange="onReadMulti" />
      <div>导入多表头数据</div>
    </div>
    <div class="cursor-pointer" @click="onExportMulti">导出多表头数据</div>
  </div>
</template>

<script setup lang="ts">
import excel from '@/utils/excel/excel'

const onRead = async (e: Event) => {
  const files: File[] = (e.target as null | { files: File[] })!.files
  const file = files[0]
  console.log(file)
  const result = await excel.readSingleExcel(file, [
    {
      prop: 'column3',
      title: '表头3',
    },
    {
      prop: 'column1',
      title: '表头1',
    },
    {
      prop: 'column2',
      title: '表头2',
    },
    {
      prop: 'column4',
      title: '表头4',
    },
    {
      prop: 'column5',
      title: '表头5',
    },
  ])
  console.log(result)
}

const onExport = () => {
  const datasource = []
  for (let idx = 0; idx < 100; idx++) {
    datasource.push({
      column1: '我是第1个参数' + (idx + 1),
      column2: '我是第2个参数' + (idx + 1),
      column3: '我是第3个参数' + (idx + 1),
      column4: '我是第4个参数' + (idx + 1),
      column5: {
        name: '我是第5个参数的子参数' + (idx + 1),
      },
      column6: {
        subName: '我是第6个参数的子参数' + (idx + 1),
      },
      column7: '我是第7个参数' + (idx + 1),
      column8: '我是第8个参数' + (idx + 1),
    })
  }
  excel.exportSingleExcel({
    columns: [
      {
        title: '标题1',
        prop: 'column1',
      },
      {
        title: '标题2',
        prop: 'column2',
      },
      {
        title: '标题3',
        prop: 'column3',
      },
      {
        title: '标题4',
        prop: 'column4',
      },
      {
        title: '标题5',
        prop: 'column5.name',
      },
      {
        title: '标题6',
        prop: ['column6', 'subName'],
      },
      {
        title: '标题7',
        transform(_, item) {
          return item['column7'] + '我是transfrom之后的内容'
        },
      },
      {
        title: '标题8',
        prop: 'column8',
      },
    ],
    datasource,
  })
}

const onReadMulti = async (e: Event) => {
  const files: File[] = (e.target as null | { files: File[] })!.files
  const file = files[0]
  console.log(file)
  excel
    .readMultiExcel(
      file,
      [
        {
          title: '表头1',
          children: [
            {
              title: '子表头1',
              children: [
                {
                  title: '孙子表头1',
                  prop: 'column1_child1_child1',
                },
                {
                  title: '孙子表头2',
                  prop: 'column1_child1_child2',
                },
              ],
            },
            {
              title: '子表头2',
              prop: 'column1_child2',
            },
          ],
        },
        {
          title: '表头2',
          children: [
            {
              title: '子表头1',
              prop: 'column2_child1',
            },
            {
              title: '子表头2',
              prop: 'column2_child2',
            },
          ],
        },
        {
          title: '表头3',
          prop: 'column3',
        },
      ],
      1,
    )
    .then((result) => {
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })
}

const onExportMulti = async () => {
  const datasource = []
  for (let idx = 0; idx < 100; idx++) {
    datasource.push({
      column1: '我是第1个参数' + (idx + 1),
      column2: '我是第2个参数' + (idx + 1),
      column3: '我是第3个参数' + (idx + 1),
      column4: '我是第4个参数' + (idx + 1),
      column5: {
        name: '我是第5个参数的子参数' + (idx + 1),
      },
      column6: {
        subName: '我是第6个参数的子参数' + (idx + 1),
      },
    })
  }
  excel.exportMultiExcel({
    columns: [
      {
        title: '表头1',
        children: [
          {
            title: '子表头1',
            children: [
              {
                title: '孙子表头1',
                prop: 'column1',
              },
              {
                title: '孙子表头2',
                prop: 'column2',
              },
            ],
          },
          {
            title: '子表头2',
            prop: 'column3',
          },
        ],
      },
      {
        title: '表头2',
        children: [
          {
            title: '子表头1',
            prop: 'column4',
          },
          {
            title: '子表头2',
            prop: 'column5.name',
          },
        ],
      },
      {
        title: '表头3',
        prop: ['column6', 'subName'],
      },
    ],
    datasource,
  })
}
</script>

<style scoped></style>
