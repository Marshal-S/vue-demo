import Excel from 'exceljs'

//读取Excel,结果返回json数组实际上是一个二维数据，可以自行处理，较为灵活
export const readExcelJson = async (file: File, sheetIndex = 0) => {
  const workbook = new Excel.Workbook()
  //是可以读取buff等信息的
  await workbook.xlsx.read(file.stream())
  const sheet = workbook.worksheets[sheetIndex]
  const data: string[][] = []
  sheet.eachRow((row) => {
    const list: string[] = []
    row.eachCell((cell) => {
      list.push(cell.value?.toString() || '')
    })
    data.push(list)
  })
  return data
}

//列方向顺序不一定，因此需要给出key、name可以按照规则映射出对应的内容
export type ReadSingleExcelType = {
  prop: string //表格中的标题映射出的key，用于前端显示或者上传
  title: string //表格中标题名称
}

//导入单表头表格，可以设置 sheet 的索引，sheet非必填默认第一个
//只映射匹配到的表头和内容
export const readSingleExcel = async (
  file: File,
  readRules: ReadSingleExcelType[],
  sheetIndex = 0,
) => {
  const workbook = new Excel.Workbook()
  //是可以读取steam、buffer等信息的，可以根据情况自行改进
  await workbook.xlsx.read(file.stream())
  const sheet = workbook.worksheets[sheetIndex]
  //row对应rule索引，后续可以直接用来赋值
  const keys: (string | null)[] = []
  const rules: (ReadSingleExcelType | null)[] = [] //用于外部返回原有顺序有效数组
  //index从1开始
  sheet.getRow(1).eachCell((cell, idx) => {
    const value = cell.value?.toString()
    const index = readRules.findIndex((e) => e.title === value)
    if (index >= 0) {
      rules.push(readRules[idx - 1])
      keys.push(readRules[index].prop)
    } else {
      keys.push(null)
    }
  })
  //生成内容
  const data: Record<string, string>[] = []
  sheet.eachRow((row, index) => {
    if (index < 2) return
    const obj: Record<string, string> = {}
    row.eachCell((cell, idx) => {
      const key = keys[idx - 1]
      if (key) {
        obj[key] = cell.value?.toString() || ''
      }
    })
    data.push(obj)
  })
  return {
    readRules: rules,
    datasource: data,
  }
}
