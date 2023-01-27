import { Injectable } from '@nestjs/common';
import { Model, SortOrder } from 'mongoose';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/interface/paginated-response.interface';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class PaginationService {
  paginate<DocType>(
    model: Model<DocType>,
    dto: PaginationQueryDto,
    {
      filter,
      sort,
    }: {
      filter?: Partial<DocType>;
      sort?: Partial<Record<keyof DocType, SortOrder>>;
    },
  ): Observable<PaginatedResponse<Array<DocType>>> {
    const { page, size: s } = dto;
    const size = s ?? 10;
    const offset = (page - 1) * size;
    const query = model.find(filter ?? {});
    if (sort) {
      query.sort(sort);
    }
    return from(query.skip(offset).limit(size).exec()).pipe(
      switchMap((records) => {
        return from(model.countDocuments(filter).exec()).pipe(
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
    const totalPages = Math.ceil(totalCount / size) || 0;
    return {
      records,
      totalPages,
      totalCount,
      page,
    };
  }
}
