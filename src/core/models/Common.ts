export enum PaginationDirection {
  prev = 'prev',
  next = 'next'
}

export interface Pagination {
  limit: number,
  current: number,
  [PaginationDirection.prev]: number;
  [PaginationDirection.next]: number;
}
