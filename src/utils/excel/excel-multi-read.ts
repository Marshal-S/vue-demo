import Excel from 'exceljs'

//多级表头必然是一个递归类型，无论是 antd，还是element，不然结构就会显得很混乱难以管理
export type ReadMultiExcelType = {
  title: string //标题名字, 必填，也是用于校验使用
  prop?: string //最深一层的propertyname可以不填写，但是最深一层对应实际数据的要填写,不能重复，否则会映射失败
  children?: ReadMultiExcelType[]
}

//导入多级表头表格，需要确认表头数量，否则会导入出错
//由于多级表头相对复杂，暂不支持内部乱序，会严格按照 column、excel数据对应，表头不一样则直接报错
export const readMultiExcel = async (
  file: File,
  readRules: ReadMultiExcelType[],
  sheetIndex = 0,
) => {
  const workbook = new Excel.Workbook()
  await workbook.xlsx.read(file.stream())
  const sheet = workbook.worksheets[sheetIndex]
  //先获取深度
  const level = getExcelLevel(readRules)
  //生成和 sheet 表头一样的结构，方便对比是否一样
  const result = generateSheetTitles(readRules, level)
  //对比校验表头
  sheet.getRows(1, level)?.forEach((row, index) => {
    row.eachCell((cell, idx) => {
      const ruleTitle = result[index][idx - 1]
      if (ruleTitle !== cell.value?.toString()) {
        throw new Error('标题不一致')
      }
    })
  })
  const keys = getExcelRealKeys(readRules)
  const data: Record<string, string>[] = []
  sheet.eachRow((row, index) => {
    if (index <= level) return
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
    readRules: readRules,
    datasource: data,
  }
}

//获取设定标题层级
const getExcelLevel = (rules?: ReadMultiExcelType[], max = -1) => {
  if (!rules || rules.length < 1) return max
  rules.forEach((e) => {
    const level = getExcelLevel(e.children, max)
    if (level > max) {
      max = level
    }
  })
  return max + 1
}

//获取设定中有效的数据个数
const getExcelColumn = (rules?: ReadMultiExcelType[], max = 0) => {
  if (!rules || rules.length < 1) return max + 1
  rules.forEach((e) => {
    const level = getExcelColumn(e.children, max)
    if (level > max) {
      max = level
    }
  })
  return max
}

const getExcelRealKeys = (rules?: ReadMultiExcelType[], result: string[] = []) => {
  if (!rules || rules.length < 1) return result
  rules.forEach((rule) => {
    if (rule.children) {
      getExcelRealKeys(rule.children, result)
    } else if (rule.prop) {
      result.push(rule.prop)
    } else {
      throw new Error('存在未设置 prop 的基础标题')
    }
  })
  return result
}

//生成用于检测的二维数组，结果和sheet中取出的表头一样(合并单元格的格子中每一个都是一样的)
const generateSheetTitles = (
  rules: ReadMultiExcelType[],
  maxLevel: number = 1,
  row: number = 0,
  column: number = 0,
  result: string[][] = [],
) => {
  rules.forEach((rule) => {
    const columns = getExcelColumn(rule.children)
    if (rule.children) {
      //处理行补全
      let start = column
      const end = column + columns
      while (start < end) {
        if (!result[row]) {
          result[row] = []
        }
        const rowResult = result[row]
        rowResult[start] = rule.title
        start++
      }
      //处理子节点
      generateSheetTitles(rule.children, maxLevel, row + 1, column, result)
    } else if (row < maxLevel) {
      //处理列补全
      let temRow = row
      do {
        if (!result[temRow]) {
          result[temRow] = []
        }
        const rowResult = result[temRow]
        rowResult[column] = rule.title
        temRow++
      } while (temRow < maxLevel)
    }
    column += columns
  })
  return result
}
