import { ExpressionResponse } from 'src/expression/interface/expression-response.interface';

export interface DivideResponse extends ExpressionResponse {
  first: string;
  second: string;
}
