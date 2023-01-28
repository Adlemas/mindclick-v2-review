import { ExpressionResponse } from 'src/expression/interface/expression-response.interface';

export interface MentalResponse extends ExpressionResponse {
  expression: number[];
}
