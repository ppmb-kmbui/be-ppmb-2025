export type ValidationError = {
  field: string;
  message: string;
};

export interface ServerResponseType<T> {
  success: boolean;
  message?: string;
  error?: string | ValidationError[];
  data?: T;
  status?: number;
}
