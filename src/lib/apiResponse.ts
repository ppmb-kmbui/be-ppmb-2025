type SuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

type ErrorResponse = {
  success: false;
  error: string | object;
};

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const errorResponse = (error: string | object): ApiResponse => ({
  success: false,
  error,
});