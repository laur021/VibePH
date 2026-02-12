export type ApiError = {
  message: string;
  statusCode: number;
  details?: string;
  errors?: {
    detail?: string;
    [key: string]: unknown;
  } | null;
};
