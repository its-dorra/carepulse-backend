export type CustomError = {
  message: string;
  statusCode: number;
  errorDetails?: { message: string }[];
};
