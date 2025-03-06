import Excel from 'exceljs'
import { saveFile } from './save-file'

export type ExcelColumns = {
  title: string //标题名称
  prop?: string | string[] //索引，例如: 'child'、'child.name'、['children', 'name']，使用有 transform 可以不填写key，但回调第一个参数就是undefined了
  width?: number //实际算是间接设置文字长度了，英文1个多一点，中文两个多一点最佳，默认按照像素数量 / 10，并预留出部分空间，一般为 12-16号字体之间，这个略长一点
  align?: 'left' | 'right' | 'center'
  transform?: (value: unknown, record: Record<string, unknown>, index: number) => string | number //转化改动后的生成的文本
}

type ExcelSingleExportParams = {
  columns: ExcelColumns[]
  datasource: Record<string, unknown>[]
  sheetname?: string
}

type ExcelSingleExportOptions = {
  creator?: string
  filename?: string
  saveFile?: (buffer: Excel.Buffer) => void
}

//基本导出功能
export async function exportSingleExcel(
  params: ExcelSingleExportParams[] | ExcelSingleExportParams,
  options?: ExcelSingleExportOptions,
): Promise<void> {
  if (!Array.isArray(params)) {
    params = [params]
  }
  if (!params.find((e) => Array.isArray(e.datasource))) {
    throw new Error('datasource数据源不存在')
  }
  //过滤掉不符合条件的标题
  params.forEach((item) => {
    item.columns = item.columns.filter((e) => e.title && (e.transform || e.prop))
  })
  const workbook = new Excel.Workbook()
  workbook.creator = options?.creator ?? '剪刀石头布啊'
  workbook.created = new Date()
  // 添加工作表
  params.forEach((param, index) => {
    addSingleSheets(param, workbook, index)
  })

  const buffer = await workbook.xlsx.writeBuffer()
  if (options?.saveFile) {
    options.saveFile(buffer)
  } else {
    saveFile(buffer, options?.filename)
  }
}

function addSingleSheets(params: ExcelSingleExportParams, workbook: Excel.Workbook, index: number) {
  const sheet = workbook.addWorksheet(params?.sheetname ?? 'sheet' + index)
  const headerColumns: Partial<Excel.Column>[] = []
  //key相关
  const infos: ColumnKeyType[] = []
  //设置表头，表头需要有标题，key，宽度，这里宽度就是列宽了
  //表头设置完毕key之后，后续读取子内容时，就是根据表头的 key 进行映射，因此key很重要
  params.columns.forEach((item) => {
    //处理我们自定义的key，因为其同时支持默认key，.和数组向下取参的方式
    const info = generateColumnKey(item)
    infos.push(info)
    headerColumns.push({
      header: item.title,
      key: info.key,
      width: item.width ? item.width / 10 : 24, //不填写默认20长度
    })
  })
  sheet.columns = headerColumns
  //根据获取的 key 信息，用于映射数据
  const data: Record<string, unknown>[] = []
  params.datasource.forEach((item, index) => {
    const obj: Record<string, unknown> = {}
    params.columns.forEach((e, idx) => {
      //映射数据，有key、keylist 就映射出实际的值
      const key = infos[idx].key
      const list = infos[idx].list
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
  //设置标题样式，第1行就是标题，没有0行
  sheet.getRow(1).eachCell({ includeEmpty: true }, (cell: Excel.Cell, colNumber: number) => {
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
      horizontal: params.columns[colNumber - 1].align ?? 'center',
      vertical: 'middle',
    }
  })
  //设置内容样式
  params.datasource.forEach((item, index) => {
    sheet
      .getRow(index + 2)
      .eachCell({ includeEmpty: true }, (cell: Excel.Cell, colNumber: number) => {
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
          horizontal: params.columns[colNumber - 1].align ?? 'center',
          vertical: 'middle',
        }
      })
  })
}

type ColumnKeyType = {
  key: string
  list?: string[]
}

function generateColumnKey(column: ExcelColumns): ColumnKeyType {
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
