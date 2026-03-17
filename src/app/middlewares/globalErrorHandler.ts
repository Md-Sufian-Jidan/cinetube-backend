import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import status from "http-status";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import { TErrorSources } from "../interfaces/error.interface";

const globalErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = status.INTERNAL_SERVER_ERROR as number;
    let message = 'Something went wrong';
    let errorSources: TErrorSources = [];
    let stack = err.stack;

    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    };

    const errorResponse = {
        success: false,
        statusCode,
        message,
        errorSources,
        stack,
    };

    res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;