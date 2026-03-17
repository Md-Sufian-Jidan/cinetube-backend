export type TErrorSources = {
  path: string;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  errorSources: TErrorSources;
  stack?: string;
  error?: unknown;
};
