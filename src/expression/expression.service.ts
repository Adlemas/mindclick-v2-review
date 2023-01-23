import { Injectable } from '@nestjs/common';
import { MentalPayloadDto } from 'src/expression/dto/mental-payload.dto';
import expression from 'src/lib/expression';
import { MultiplyPayloadDto } from 'src/expression/dto/mutliply-payload.dto';
import { MultiplyResponse } from 'src/expression/interface/multiply-response.interface';
import multiply from 'src/lib/multiply';

@Injectable()
export class ExpressionService {
  mental(payload: MentalPayloadDto): number[] {
    const { formula, terms, min, max, isBiggerMax } = payload;
    return expression(formula, terms, min, max, isBiggerMax);
  }

  multiply(payload: MultiplyPayloadDto): MultiplyResponse {
    const { first, second } = payload;
    return multiply(first[0].length, second[0].length, first, second);
  }
}
