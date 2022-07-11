export interface ErrorResponse {
  code: number;
  errorMsg: string;
}

export interface GetListRequest {
  page: number;
  pageSize: number;
}

export interface GetListResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ById {
  id: string;
}
