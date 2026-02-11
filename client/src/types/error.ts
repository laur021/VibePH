export type ApiError = {
  message: string;
  statusCode: number;
  details?: string; // Stack trace (optional)
};
