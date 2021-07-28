export enum ApiResponseStatus {
  Success = 'success',
  Error = 'error',
}

export interface ApiResponsePayload<T> {
  status: ApiResponseStatus;
  httpStatus: string;
  message: string;
  result: T;
}

export interface ApiListResponsePayload<T> {
  status: ApiResponseStatus;
  httpStatus: string;
  message: string;
  result: Array<T>;
}
