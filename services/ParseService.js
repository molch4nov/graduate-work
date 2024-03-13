import XLSX from 'xlsx'
import * as fs from "fs";

const workbook = XLSX.readFile('../docs/index.xlsx');
const sheet_name_list = workbook.SheetNames;


fs.writeFileSync('./target.json', JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[3]])))