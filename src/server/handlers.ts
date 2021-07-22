import { RequestHandler, ErrorRequestHandler } from "express";
import { json } from "body-parser";
import * as cors from "cors";
import * as morgan from "morgan";
import { ValidationError } from "./validation";
import { NotFoundError } from "../utils";
import { logger, loggerMorgan } from "../logger";

//
// Middlewares
//
export const middlewares: RequestHandler[] = [
  morgan("combined", { stream: loggerMorgan }),
  cors({ origin: "*" }),
  json(),
];

//
// Not found handler
//
export const onNotFound: RequestHandler = (req, res, _next) => {
  res
    .status(404)
    .json({ status: "error", message: `Not found ${req.originalUrl}` });
};

//
// Error handler
//
export const onError: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof NotFoundError) {
    onNotFound(req, res, next);
    return;
  }
  if (error instanceof ValidationError) {
    res.status(400).json({
      status: "error",
      message: error.message,
      data: error.errors,
    });
    return;
  }
  logger.error(error);
  res.status(500).json({ status: "error", message: error.toString() });
};
