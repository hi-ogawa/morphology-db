import { Request, Response } from "express";
import { validate, SchemaKey } from "../validation";
import { assertDefined, NotFoundError } from "../../utils";

export class ApplicationController {
  constructor(protected req: Request, protected res: Response) {}

  protected render(data: any) {
    this.res.json({ status: "success", data });
  }

  protected validate(key: SchemaKey, data: any): any {
    return validate(key, data);
  }

  protected assertFound<T>(x: T) {
    assertDefined(x, new NotFoundError());
  }
}
