import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pug = require('pug');
import { DividePayloadDto } from 'src/expression/dto/divide-payload.dto';
import Divide from 'src/lib/divide';
import { MultiplyPayloadDto } from 'src/expression/dto/mutliply-payload.dto';
import generateMultiply from 'src/lib/multiply';

type HTML = string;

export interface GenerateOptions {
  rows: number;
  columns: number;
}

export const divide = (
  payload: DividePayloadDto,
  options: GenerateOptions,
): HTML => {
  const expressions = [];

  for (let i = 0; i < options.rows; i++) {
    const row = [];
    for (let j = 0; j < options.columns; j++) {
      const { first, second } = Divide(payload.first, payload.second, {
        remainder: payload.remainder,
      });
      row.push([first, second]);
    }
    expressions.push(row);
  }

  return pug.renderFile(
    path.join(__dirname, 'templates/a4-divide-multiply.pug'),
    {
      rows: expressions,
      first: [payload.first],
      second: [payload.second],
      divider: '÷',
      title: 'MindClick - Деление',
    },
  );
};

export const multiply = (
  payload: MultiplyPayloadDto,
  options: GenerateOptions,
): HTML => {
  const expressions = [];

  for (let i = 0; i < options.rows; i++) {
    const row = [];
    for (let j = 0; j < options.columns; j++) {
      const { first, second } = generateMultiply(
        payload.first[0].length,
        payload.second[0].length,
        payload.first,
        payload.second,
      );
      row.push([first, second]);
    }
    expressions.push(row);
  }

  return pug.renderFile(
    path.join(__dirname, 'templates/a4-divide-multiply.pug'),
    {
      rows: expressions,
      first: payload.first,
      second: payload.second,
      divider: '×',
      title: 'MindClick - Умножение',
    },
  );
};
