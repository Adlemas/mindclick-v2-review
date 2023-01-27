import { Injectable } from '@nestjs/common';
import { Query } from 'mongoose';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/interface/paginated-response.interface';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class PaginationService {
  paginate<ResultType extends Array<any>, DocType>(
    query: Query<ResultType, DocType>,
    dto: PaginationQueryDto,
  ): Observable<PaginatedResponse<ResultType>> {
    const { page, size } = dto;
    const offset = (page - 1) * size;
    return from(query.skip(offset).limit(size).exec()).pipe(
      switchMap((records) => {
        return from(query.countDocuments().exec()).pipe(
          switchMap((totalCount) => {
            return of(this.buildPaginatedResponse(records, dto, totalCount));
          }),
        );
      }),
    );
  }

  buildPaginatedResponse<ResultType>(
    records: ResultType,
    dto: PaginationQueryDto,
    totalCount: number,
  ): PaginatedResponse<ResultType> {
    const { page, size } = dto;
    const totalPages = Math.ceil(totalCount / size);
    return {
      records,
      totalPages,
      totalCount,
      page,
    };
  }
}
