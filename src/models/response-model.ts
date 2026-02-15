export interface ResponseModel<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}
