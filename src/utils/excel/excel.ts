import { readMultiExcel } from "./excel-multi-read"
import { exportMultiExcel } from './excel-multi-export'
import { readExcelJson, readSingleExcel } from "./excel-read"
import { exportSingleExcel } from "./excel-export"

//统一导出，可以避免外部使用导出好几个情况(不止后续是否还会增加)，也可以直接使用
export default {
  readExcelJson,
  readSingleExcel,
  readMultiExcel,
  exportSingleExcel,
  exportMultiExcel,
}
