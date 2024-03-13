import XLSX from 'xlsx'

const workbook = XLSX.readFile('../docs/index.xlsx');
const sheet_name_list = workbook.SheetNames;
console.log(sheet_name_list)
// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
