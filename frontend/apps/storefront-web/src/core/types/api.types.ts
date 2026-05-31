// API Standard Types and Pagination Interfaces (SPEC_CORE_FE)

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
}

export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

export interface PaginationResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
