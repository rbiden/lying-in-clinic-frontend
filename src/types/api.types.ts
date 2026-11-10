export interface ApiResponse<T> {
  data: T
}

export interface MessageResponse {
  message: string
}

export interface ValidationErrorResponse extends MessageResponse {
  errors: Record<string, string[]>
}

export interface PaginateResponse<T> extends ApiResponse<T[]> {
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
    links: Array<{ url: string | null; label: string; active: boolean }>
  }
}
