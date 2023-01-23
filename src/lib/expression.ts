export type Expression = (
  formula: string,
  terms: number,
  min: number,
  max: number,
  isBiggerMax: boolean,
) => number[];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const expression: Expression = require('src/external/expression.js').default;

export default expression;
