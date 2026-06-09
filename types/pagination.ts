/** Pagination metadata returned alongside a page of list data. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** A page of `data` plus the metadata to navigate the rest. */
export interface Paginated<T> {
  data: T[];
  pagination: PaginationMeta;
}
