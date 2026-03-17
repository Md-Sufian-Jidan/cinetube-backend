import { z } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error.interface';
import status from 'http-status';

const handleZodError = (err: z.ZodError): TGenericErrorResponse => {


  const statusCode = status.BAD_REQUEST;
  const message = 'Validation Error From Zod';
  const errorSources: TErrorSources = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join('.'),
      message: issue.message,
    });
  });

  return {
    statusCode,
    success: false,
    message,
    errorSources,
  };
};

export default handleZodError;
