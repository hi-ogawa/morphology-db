import { RequestHandler } from "express";
import { json } from "body-parser";
import * as cors from "cors";
import * as morgan from "morgan";
import { loggerMorgan } from "../logger";

//
// Middlewares
//
export const middlewares: RequestHandler[] = [
  morgan("combined", { stream: loggerMorgan }),
  cors({ origin: "*" }),
  json(),
];
