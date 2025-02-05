export type CategoryListItem = {
  name: string;
  status: string;
};

export type CategoryListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type CategoryListParams = {
  status?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};