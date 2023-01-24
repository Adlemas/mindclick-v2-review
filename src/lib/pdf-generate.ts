/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
import { jsPDF } from 'jspdf';

import { Buffer } from 'node:buffer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Excel = require('exceljs');
import xlsxGenerate, { Row } from './xlsx-generate';
import expression from './expression';
import { Readable } from 'node:stream';
import * as path from 'path';

require(path.resolve(__dirname, '../external/fonts/Blogger Sans-normal'));
require(path.resolve(__dirname, '../external/fonts/Blogger Sans-bold'));

type PageProps = {
  hCount: number;
  vCount: number;
  isAutoHeight: boolean;
};

type ReduceProps = {
  byPage: boolean;
  byRows: number;
  isGrow: boolean;
  isGrowByRows: boolean;
};

export type CountSettings = {
  formula: string;
  min: number;
  max: number;
  termLength: number;
};

// eslint-disable-next-line max-len
const generate = async (
  { formula, max, min, termLength }: CountSettings,
  pageCount: number,
  { hCount, vCount, isAutoHeight }: PageProps,
  { byPage, byRows, isGrow, isGrowByRows }: ReduceProps,
  orientation: 'p' | 'l',
  withRight: boolean,
  design: boolean,
  fileFormat: 'pdf' | 'excel',
): Promise<Readable> => {
  const document = new jsPDF({
    unit: 'mm',
    orientation,
  });
  const WIDTH = document.internal.pageSize.getWidth();
  const HEIGHT = document.internal.pageSize.getHeight();
  const TEXT_MARGIN = 7;
  const TABLE_WIDTH = 17;
  let TABLE_HEIGHT = (TEXT_MARGIN / 2 + TEXT_MARGIN) * termLength;
  const HCOUNT = hCount;
  let H_MARGIN = (WIDTH - HCOUNT * TABLE_WIDTH) / (HCOUNT + 1);
  let VCOUNT = isAutoHeight
    ? Math.floor((HEIGHT - H_MARGIN) / (TABLE_HEIGHT + H_MARGIN))
    : vCount;
  let V_MARGIN = (HEIGHT - VCOUNT * TABLE_HEIGHT) / (VCOUNT + 1);

  const EXPRESSIONS: number[][] = [];

  let TERMS = termLength;

  document.setFontSize(16);
  document.setFont('Blogger Sans', 'bold');

  let globalRowCount = 0;

  const init = () => {
    TABLE_HEIGHT = (TEXT_MARGIN / 2 + TEXT_MARGIN) * TERMS;
    VCOUNT = isAutoHeight
      ? Math.floor((HEIGHT - H_MARGIN) / (TABLE_HEIGHT + H_MARGIN))
      : vCount;
    V_MARGIN = (HEIGHT - VCOUNT * TABLE_HEIGHT) / (VCOUNT + 1);
  };

  const grow = () => {
    TERMS += 1;
    TABLE_HEIGHT = (TEXT_MARGIN / 2 + TEXT_MARGIN) * TERMS;
    if (isAutoHeight && TABLE_HEIGHT * VCOUNT + V_MARGIN > HEIGHT) {
      VCOUNT -= 1;
      while (
        TABLE_HEIGHT * VCOUNT +
          (HEIGHT - VCOUNT * TABLE_HEIGHT) / (VCOUNT + 1) >
        HEIGHT
      )
        VCOUNT -= 1;
    }
    V_MARGIN = (HEIGHT - VCOUNT * TABLE_HEIGHT) / (VCOUNT + 1);
  };

  let globalExpressionCount = 0;

  const drawPage = (isRight: boolean) => {
    if (design) {
      if (isGrow && byPage === true && globalRowCount !== 0) grow();
      if (isGrow && isGrowByRows && globalRowCount % byRows === 0) grow();
      const fHeight = TEXT_MARGIN / 2 + TEXT_MARGIN;
      H_MARGIN = WIDTH - (hCount * TABLE_WIDTH + TABLE_WIDTH);
      VCOUNT = isAutoHeight
        ? Math.floor(
            (HEIGHT - H_MARGIN * 0.8) /
              (TABLE_HEIGHT + fHeight * 2 + H_MARGIN * 0.8),
          )
        : vCount;
      H_MARGIN /= 2;
      V_MARGIN = (HEIGHT - VCOUNT * (TABLE_HEIGHT + fHeight * 3)) / VCOUNT;
      let hPosition = H_MARGIN;
      let vPosition = V_MARGIN / 2;
      document.text('Решено правильно___________', 13, V_MARGIN / 2);
      document.text(
        'Решено неправильно_________',
        13 + 'Решено правильно___________'.length * 3 + 13,
        V_MARGIN / 2,
      );
      for (let y = 0; y < VCOUNT; y += 1) {
        vPosition = V_MARGIN + y * (TABLE_HEIGHT + fHeight * 2 + V_MARGIN);
        // Drawing first line
        for (let fx = 0; fx < HCOUNT + 1; fx += 1) {
          if (fx > 0) {
            document.setFillColor(0, 255, 0);
            document.setTextColor(255, 255, 255);
          } else {
            document.setFillColor(255, 255, 255);
            document.setTextColor(0, 0, 0);
          }
          hPosition = H_MARGIN + fx * TABLE_WIDTH;
          document.rect(hPosition, vPosition, TABLE_WIDTH, fHeight, 'DF');
          document.text(
            fx === 0 ? `N${String(y + 1)}` : String(fx),
            hPosition + TEXT_MARGIN,
            vPosition + TEXT_MARGIN,
          );
        }
        // Drawing expressions
        vPosition += fHeight;
        for (let x = 0; x < HCOUNT + 1; x += 1) {
          hPosition = H_MARGIN + x * TABLE_WIDTH;
          if (x === 0) {
            let vpos = vPosition;
            for (let fy = 0; fy < TERMS + 2; fy += 1) {
              vpos = vPosition + fy * fHeight;
              document.setFillColor(235, 128, 52);
              document.setTextColor(255, 255, 255);
              document.rect(hPosition, vpos, TABLE_WIDTH, fHeight, 'DF');
              document.text(
                fy < TERMS ? String(fy + 1) : '-',
                hPosition + TEXT_MARGIN,
                vpos + TEXT_MARGIN,
              );
              if (fy >= TERMS)
                document.text(
                  '-',
                  hPosition + TEXT_MARGIN,
                  vpos + TEXT_MARGIN + 1.2,
                );
            }
          } else {
            /**
                         * document.setDrawColor(204, 204, 204)
                            document.line(hpos, vpos + fHeight, hpos + TABLE_WIDTH, vpos + fHeight)
                            document.setDrawColor(0, 0, 0)
                         */
            let vpos = vPosition;
            const hpos = hPosition;
            const Expression = expression(formula, TERMS, min, max, false);
            document.setFillColor(255, 255, 255);
            document.setDrawColor(0, 0, 0);
            document.rect(
              hpos,
              vpos,
              TABLE_WIDTH,
              TABLE_HEIGHT + fHeight * 2,
              'DF',
            );
            for (let fy = 0; fy < TERMS + 2; fy += 1) {
              vpos = vPosition + fy * fHeight;
              document.setTextColor(0, 0, 0);
              // document.rect(hpos, vpos, TABLE_WIDTH, fHeight, 'DF')
              if (fy < TERMS) {
                document.text(
                  String(Expression[fy]),
                  hpos + TEXT_MARGIN * 1.7,
                  vpos + TEXT_MARGIN,
                  {
                    align: 'right',
                  },
                );
              }
            }
            document.setDrawColor(0, 0, 0);
            document.line(
              H_MARGIN + TABLE_WIDTH,
              vPosition + TABLE_HEIGHT,
              hPosition + TABLE_WIDTH,
              vPosition + TABLE_HEIGHT,
            );
            document.setDrawColor(204, 204, 204);
            document.line(
              H_MARGIN + TABLE_WIDTH,
              vPosition + TABLE_HEIGHT + fHeight,
              hPosition + TABLE_WIDTH,
              vPosition + TABLE_HEIGHT + fHeight,
            );
            document.setDrawColor(0, 0, 0);
          }
        }
        globalRowCount += 1;
      }
    } else {
      // Drawing rectangles
      let hPosition = H_MARGIN;
      let vPosition = V_MARGIN;
      for (let y = 0; y < VCOUNT; y += 1) {
        vPosition = y * (TABLE_HEIGHT + V_MARGIN) + V_MARGIN;
        if (
          isGrow === true &&
          isGrowByRows === true &&
          globalRowCount % byRows === 0 &&
          globalRowCount > 1
        ) {
          grow();
          vPosition = y * (TABLE_HEIGHT + V_MARGIN) + V_MARGIN;
        }
        for (let x = 0; x < HCOUNT; x += 1) {
          hPosition = x * (TABLE_WIDTH + H_MARGIN) + H_MARGIN;
          document.rect(hPosition, vPosition, TABLE_WIDTH, TABLE_HEIGHT, 'S');
          document.line(
            hPosition,
            vPosition + TABLE_HEIGHT - TEXT_MARGIN,
            hPosition + TABLE_WIDTH,
            vPosition + TABLE_HEIGHT - TEXT_MARGIN,
          );
          // Drawing texts
          let Expression = [];
          if (!isRight)
            Expression = expression(formula, TERMS, min, max, false);
          else {
            Expression = EXPRESSIONS[globalExpressionCount];
            globalExpressionCount += 1;
          }
          if (!isRight) EXPRESSIONS.push(Expression);
          document.text(
            Expression.join('\n'),
            hPosition + TABLE_WIDTH / 2 + TEXT_MARGIN / 2,
            vPosition + TEXT_MARGIN,
            {
              align: 'right',
            },
          );
          if (isRight) {
            let rightAnswer = 0;
            Expression.forEach((term) => {
              rightAnswer += term;
            });
            document.setTextColor(255, 0, 0);
            document.text(
              String(rightAnswer),
              hPosition + TABLE_WIDTH / 2 + TEXT_MARGIN / 2,
              vPosition + TABLE_HEIGHT - TEXT_MARGIN / 4,
              {
                align: 'right',
              },
            );
            document.setTextColor(0, 0, 0);
          }
        }
        globalRowCount += 1;
      }
    }
  };

  if (fileFormat === 'pdf') {
    drawPage(false);
    for (let i = 0; i < pageCount - 1; i += 1) {
      document.addPage();
      drawPage(false);
    }
    if (withRight) {
      TERMS = termLength;
      init();
      for (let i = 0; i < pageCount; i += 1) {
        document.addPage();
        drawPage(true);
      }
    }
    const buffer = Buffer.from(document.output('arraybuffer'));
    // convert buffer to stream
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
  if (fileFormat === 'excel') {
    const workbook = new Excel.Workbook();

    // eslint-disable-next-line no-unreachable-loop
    for (let y = 0; y < pageCount; y += 1) {
      const columns = [{ header: 'N1', key: 'key' }];
      const rows = [];

      for (let i = 0; i < hCount; i += 1) {
        columns.push({ header: String(i + 1), key: String(i + 1) });
      }

      for (let x = 0; x < vCount; x += 1) {
        const expressions = [];

        for (let i = 0; i < hCount; i += 1) {
          expressions.push(expression(formula, termLength, min, max, false));
        }

        for (let i = 0; i < termLength; i += 1) {
          const obj: Row = {
            key: String(i + 1),
          };
          for (let j = 0; j < expressions.length; j += 1) {
            obj[String(j + 1)] = expressions[j][i];
          }
          rows.push(obj);
        }

        /**
         * Add break line
         */
        const obj: Row = {
          key: '',
        };
        for (let j = 0; j < expressions.length; j += 1) {
          obj[String(j + 1)] = '';
        }
        rows.push(obj);
      }
      return xlsxGenerate(columns, rows, y + 1, workbook);
    }
  }

  return null;
};

export default generate;
