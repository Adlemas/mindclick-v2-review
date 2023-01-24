// eslint-disable-next-line @typescript-eslint/no-var-requires
const Excel = require('exceljs');
import { Readable } from 'stream';

export type Column = { header: string; key: string };

export type Row = { [key: string]: number | string };

async function generate(
  columns: Column[],
  data: Row[],
  i: number,
  workbook: any,
) {
  const worksheet = workbook.addWorksheet(`Mental Count ${i}`);
  worksheet.columns = columns;
  worksheet.columns.forEach((_, index) => {
    worksheet.columns[index].width = 5;
  });
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' },
    bgColor: { argb: 'FF00FF00' },
  };
  worksheet.getColumn(1).font = { bold: true };

  data.forEach((e) => {
    worksheet.addRow(e);
  });
  const buffer = await workbook.xlsx.writeBuffer();
  // convert buffer to stream
  const stream = new Readable();

  stream.push(buffer);
  stream.push(null);
  return stream;
}

export default generate;
