export interface PaginatedResponse<T> {
  records: T;
  totalPages: number;
  totalCount: number;
  page: number;
}
