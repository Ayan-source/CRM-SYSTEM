import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "./error.js";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(new AppError(messages.join(", "), 400));
  }
  next();
};
