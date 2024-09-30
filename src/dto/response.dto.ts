export class HttpResponse<T> {
  result: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
