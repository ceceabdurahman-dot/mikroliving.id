import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/httpError";

export function apiNotFoundHandler(req: Request, res: Response, next: NextFunction) {
  void res;
  next(new HttpError(404, `API route not found: ${req.method} ${req.originalUrl}`));
}
