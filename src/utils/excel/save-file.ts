import Excel from 'exceljs'

export const saveFile = (buffer: Excel.Buffer, filename?: string) => {
  //.xls 为 application/vnd.ms-excel
  //.xlsx 为 application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  if (filename) {
    const list = filename.split('.')
    //如果扩展名部位xls、xlsx 则默认改成 .xlsx
    if (list.pop() === 'xls') {
      type = 'application/vnd.ms-excel'
    } else {
      filename = list.join('.') + '.xlsx'
    }
  }
  const blob = new Blob([buffer], {
    type,
  })
  const url = URL.createObjectURL(blob)
  const aLink = document.createElement('a')
  aLink.setAttribute('download', filename ? filename : `${new Date().getTime()}.xlsx`)
  aLink.setAttribute('href', url)
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
  URL.revokeObjectURL(url)
}
