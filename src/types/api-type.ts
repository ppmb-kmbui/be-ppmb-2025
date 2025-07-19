import type { ZodIssue } from "zod";

export type ValidationError = {
  field: string;
  message: string;
};

export interface ServerResponseType<T> {
  success: boolean;
  message?: string;
  error?: string | ZodIssue[] | ValidationError[];
  data?: T;
  status?: number;
}
