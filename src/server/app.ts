import express from "express";
import { middlewares, onNotFound, onError } from "./handlers";
import { routes } from "./routes";

export const app = express();

app.use(middlewares);
app.use(routes);
app.use(onNotFound);
app.use(onError);
