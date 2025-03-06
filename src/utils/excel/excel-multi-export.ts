import Excel from 'exceljs'
import { saveFile } from './save-file'

export type ExportExcelMultiColumns = {
  title: string //标题名称 除了标题非必填，最深一层次的 prop 或者 transform还是要填写的
  prop?: string | string[] //索引，例如: 'child'、'child.name'、['children', 'name']，使用有 transform 可以不填写key，但回调第一个参数就是undefined了
  width?: number //实际算是间接设置文字长度了，英文1个多一点，中文两个多一点最佳，默认按照像素数量 / 10，并预留出部分空间，一般为 12-16号字体之间，这个略长一点
  align?: 'left' | 'right' | 'center'
  transform?: (value: unknown, record: Record<string, unknown>, index: number) => string | number //转化改动后的生成的文本
  children?: ExportExcelMultiColumns[]
}

type ExcelMultiExportParams = {
  columns: ExportExcelMultiColumns[]
  datasource: Record<string, unknown>[]
  sheetname?: string
}

type ExcelMultiExportOptions = {
  creator?: string
  filename?: string
  saveFile?: (buffer: Excel.Buffer) => void
}

//column 最深一层的 prop或者transform必填，父节点只需要传递 title、children即可
export const exportMultiExcel = async (
  params: ExcelMultiExportParams | ExcelMultiExportParams[],
  options?: ExcelMultiExportOptions,
) => {
  if (!Array.isArray(params)) {
    params = [params]
  }
  if (!params.find((e) => Array.isArray(e.datasource))) {
    throw new Error('datasource数据源不存在')
  }
  const workbook = new Excel.Workbook()
  workbook.creator = options?.creator ?? '剪刀石头布啊'
  workbook.created = new Date()
  params.forEach((param, index) => {
    addMultiSheet(param, workbook, index)
  })

  const buffer = await workbook.xlsx.writeBuffer()
  if (options?.saveFile) {
    options.saveFile(buffer)
  } else {
    saveFile(buffer, options?.filename)
  }
}

function addMultiSheet(params: ExcelMultiExportParams, workbook: Excel.Workbook, index: number) {
  // 添加工作表
  const sheet = workbook.addWorksheet(params?.sheetname ?? 'sheet' + index)

  //key相关
  const infos = getExcelRealKeys(params.columns)
  //对比校验表头
  const headerColumns: Partial<Excel.Column>[] = []
  //生成表头的数据
  //设置表头，表头需要有标题，key，宽度，这里宽度就是列宽了
  //表头设置完毕key之后，后续读取子内容时，就是根据表头的 key 进行映射，因此key很重要
  infos.forEach((item) => {
    headerColumns.push({
      header: item.title,
      key: item.keyInfo.key,
      width: item.width ? item.width / 10 : 24, //不填写默认24长度
    })
  })
  sheet.columns = headerColumns
  //根据获取的 key 信息，用于映射数据
  const data: Record<string, unknown>[] = []
  params.datasource.forEach((item, index) => {
    const obj: Record<string, unknown> = {}
    infos.forEach((e, idx) => {
      //映射数据，有key、keylist 就映射出实际的值
      const key = infos[idx].keyInfo.key
      const list = infos[idx].keyInfo.list
      let value: unknown
      if (list) {
        let temValue = item
        list.forEach((itm) => {
          temValue = temValue[itm] as Record<string, unknown>
        })
        value = temValue
      } else if (key) {
        value = item[key]
      }
      //transfrom设置prop就映射内容，不设置就不映射，只能用第二个参数了
      if (e.transform) {
        //没有设置key
        obj[key] = e.transform(item[key] as unknown, item, index)
      } else {
        obj[key] = value
      }
    })
    data.push(obj)
  })
  sheet.addRows(data)

  //更新第一级标题为空，在添加剩下的标题列
  sheet.getRow(1).values = []
  const level = getExcelLevel(params.columns)
  for (let idx = 1; idx < level; idx++) {
    sheet.insertRow(1, [])
  }
  //生成标题
  addSheetTitles(sheet, params.columns, level)

  //设置标题样式，第1行就是标题，没有0行，从 1~level行就是表头
  sheet.getRows(1, level)?.forEach((row, index) => {
    row.eachCell({ includeEmpty: true }, (cell: Excel.Cell, colNumber: number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FFDEE6F0',
        },
      }
      cell.font = {
        size: 14,
        color: { argb: 'FF000000' }, // 黑色
        bold: true,
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      cell.alignment = {
        horizontal: index === level ? infos[colNumber - 1].align || 'center' : 'center',
        vertical: 'middle',
      }
    })
  })
  sheet.getRows(level + 1, params.datasource.length)?.forEach((row) => {
    row.eachCell({ includeEmpty: true }, (cell: Excel.Cell, colNumber: number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FFFFFFFF',
        },
      }
      cell.font = {
        size: 12,
        color: { argb: 'FF000000' }, // 黑色
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      cell.alignment = {
        horizontal: infos[colNumber - 1].align ?? 'center',
        vertical: 'middle',
      }
    })
  })
}

type ColumnKeyType = {
  key: string
  list?: string[]
}

type ColumnKeyInfoType = ExportExcelMultiColumns & {
  keyInfo: ColumnKeyType
}

function generateColumnKey(column: ExportExcelMultiColumns): ColumnKeyType {
  const info: ColumnKeyType = {
    key: '',
  }
  if (column.transform) {
    if (!column.prop) return info
  } else if (!column.prop) {
    throw new Error('需要设置prop属性，或使用transform函数转化')
  }
  let list: string[]
  if (Array.isArray(column.prop)) {
    list = column.prop
  } else {
    list = column.prop.split('.')
  }
  if (list.length < 2) {
    info.key = list[0]
  } else {
    info.key = list.join('__')
    info.list = list
  }
  return info
}

//获取设定标题层级
const getExcelLevel = (rules?: ExportExcelMultiColumns[], max = -1) => {
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
const getExcelColumn = (rules?: ExportExcelMultiColumns[], max = 0) => {
  if (!rules || rules.length < 1) return max + 1
  rules.forEach((e) => {
    const level = getExcelColumn(e.children, max)
    if (level > max) {
      max = level
    }
  })
  return max
}

const getExcelRealKeys = (
  rules?: ExportExcelMultiColumns[],
  result: ColumnKeyInfoType[] = [],
  level: number = 0,
) => {
  if (!rules || rules.length < 1) return result
  rules.forEach((rule) => {
    if (rule.children) {
      getExcelRealKeys(rule.children, result, level + 1)
    } else if (rule.prop) {
      result.push({
        title: rule.title,
        width: rule.width,
        align: rule.align,
        transform: rule.transform,
        keyInfo: generateColumnKey(rule),
      })
    } else {
      throw new Error('存在未设置 prop 的基础标题')
    }
  })
  return result
}

//生成用于检测的二维数组，结果和sheet中取出的表头一样(合并单元格的格子中每一个都是一样的)
const addSheetTitles = (
  sheet: Excel.Worksheet,
  rules: ExportExcelMultiColumns[],
  maxLevel: number = 1,
  row: number = 1,
  column: number = 1,
) => {
  rules.forEach((rule) => {
    const columns = getExcelColumn(rule.children)
    sheet.getCell(row, column).value = rule.title
    if (rule.children) {
      sheet.mergeCells([row, column, row, column + columns - 1, rule.title])
      addSheetTitles(sheet, rule.children, maxLevel, row + 1, column)
    } else if (row <= maxLevel) {
      sheet.mergeCells([row, column, maxLevel, column, rule.title])
    }
    column += columns
  })
}
