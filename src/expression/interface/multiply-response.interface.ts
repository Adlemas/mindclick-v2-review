import { ExpressionResponse } from 'src/expression/interface/expression-response.interface';

export interface MultiplyResponse extends ExpressionResponse {
  first: number;
  second: number;
}
