import { Injectable } from '@nestjs/common';
import { Query } from 'mongoose';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';

@Injectable()
export class PaginationService {
  paginate<ResultType, DocType>(
    query: Query<ResultType, DocType>,
    dto: PaginationQueryDto,
  ) {
    const { page, size } = dto;
    const offset = (page - 1) * size;
    return query.skip(offset).limit(size);
  }
}
