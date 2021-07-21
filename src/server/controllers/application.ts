import { Request, Response } from "express";
import { validate, SchemaKey } from "../validation";

export class NotFoundError extends Error {}

export class ApplicationController {
  constructor(protected req: Request, protected res: Response) {}

  protected render(data: any) {
    this.res.json({ status: "success", data });
  }

  protected validate(key: SchemaKey, data: any): any {
    return validate(key, data);
  }

  protected assertDefined<T, E extends Error>(
    x: T,
    error?: E
  ): asserts x is NonNullable<T> {
    if (x === undefined || x === null) {
      if (error === undefined) {
        throw new NotFoundError();
      }
      throw error;
    }
  }
}
