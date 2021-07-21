import { RequestHandler, ErrorRequestHandler } from "express";
import { json } from "body-parser";
import * as cors from "cors";
import * as morgan from "morgan";
import { config } from "../config";
import { ValidationError } from "./validation";
import { NotFoundError } from "./controllers/application";

export const middlewares: RequestHandler[] = [
  (_req, _res, next) => next(), // no-op handler since `Express.use` expects one handler at least)
];
if (config.ENV !== "test") {
  middlewares.push(morgan("combined"));
}
middlewares.push(cors({ origin: "*" }));
middlewares.push(json());

export const onNotFound: RequestHandler = (req, res, _next) => {
  res
    .status(404)
    .json({ status: "error", message: `Not found ${req.originalUrl}` });
};

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
  console.error(error);
  res.status(500).json({ status: "error", message: error.toString() });
};
