import type { RequestHandler } from "express";
import type { z, ZodError } from "zod";
import type { CustomError } from "../types/error";

export const validateDataWithZod = (schema: z.ZodObject<any, any>) => {
  const middleware: RequestHandler = (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (result.error) {
        throw result.error;
      }
      req.body = result.data;
      next();
    } catch (err) {
      console.error(err);
      const error: CustomError = {
        message: "Invalid data",
        statusCode: 400,
        errorDetails: (err as ZodError).errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        })),
      };
      next(error);
    }
  };

  return middleware;
};
