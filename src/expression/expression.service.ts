import { Injectable, StreamableFile } from '@nestjs/common';

import { MentalPayloadDto } from 'src/expression/dto/mental-payload.dto';
import expression from 'src/lib/expression';

import { MultiplyPayloadDto } from 'src/expression/dto/mutliply-payload.dto';
import { MultiplyResponse } from 'src/expression/interface/multiply-response.interface';
import multiply from 'src/lib/multiply';

import { DividePayloadDto } from 'src/expression/dto/divide-payload.dto';
import { DivideResponse } from 'src/expression/interface/divide-response.interface';
import divide from 'src/lib/divide';
import { MentalDocumentPayloadDto } from 'src/expression/dto/mental-documet-query.dto';
import pdfGenerate from 'src/lib/pdf-generate';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class ExpressionService {
  mental(payload: MentalPayloadDto): number[] {
    const { formula, terms, min, max, isBiggerMax } = payload;
    return expression(formula, terms, min, max, isBiggerMax);
  }

  mentalDocument(
    payload: MentalDocumentPayloadDto,
  ): Observable<StreamableFile> {
    return from(
      pdfGenerate(
        {
          formula: payload.formula,
          termLength: payload.terms,
          min: payload.min,
          max: payload.max,
        },
        payload.pageCount,
        {
          hCount: payload.hCount,
          vCount: payload.vCount,
          isAutoHeight: payload.isAutoHeight,
        },
        {
          byPage: payload.byPage,
          byRows: payload.byRows,
          isGrow: payload.isGrow,
          isGrowByRows: payload.isGrowByRows,
        },
        payload.orientation,
        payload.withRight,
        payload.design,
        payload.fileFormat,
      ),
    ).pipe(
      switchMap((stream) => {
        console.log({ stream });
        return of(new StreamableFile(stream));
      }),
    );
  }

  multiply(payload: MultiplyPayloadDto): MultiplyResponse {
    const { first, second } = payload;
    return multiply(first[0].length, second[0].length, first, second);
  }

  divide(payload: DividePayloadDto): DivideResponse {
    const { first, second, remainder } = payload;
    return divide(first, second, { remainder: remainder ?? 0 });
  }
}
