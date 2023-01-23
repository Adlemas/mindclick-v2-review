import { Injectable } from '@nestjs/common';
import { MentalPayloadDto } from 'src/expression/dto/mental-payload.dto';
import expression from 'src/lib/expression';

@Injectable()
export class ExpressionService {
  mental(payload: MentalPayloadDto): number[] {
    const { formula, terms, min, max, isBiggerMax } = payload;
    return expression(formula, terms, min, max, isBiggerMax);
  }
}
