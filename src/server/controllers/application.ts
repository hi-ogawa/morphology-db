import { BaseEntity, SelectQueryBuilder } from "typeorm";
import { BaseController } from "ts-actionpack";
import { validate, SchemaKey } from "../validation";
import { assertDefined, NotFoundError } from "../../utils";
import { logger } from "../../logger";
import { ValidationError } from "../validation";

export abstract class ApplicationController extends BaseController {
  protected render(data: any) {
    this.res.json({ status: "success", data });
  }

  protected validate(key: SchemaKey, data: any): any {
    return validate(key, data);
  }

  protected assertFound<T>(x: T) {
    assertDefined(x, new NotFoundError());
  }

  protected async paginate<T extends BaseEntity>(
    queryBuilder: SelectQueryBuilder<T>
  ) {
    const { page, perPage } = this.validate("pagination", this.req.query);
    const limit = perPage;
    const offset = perPage * (page - 1);
    const count = await queryBuilder.getCount();
    const data = await queryBuilder.limit(limit).offset(offset).getMany();
    const maxPage = Math.ceil(count / perPage);
    this.res.json({
      status: "success",
      pagination: {
        page,
        perPage,
        maxPage,
        count,
      },
      data,
    });
  }

  protected handleNotFound() {
    this.res.status(404).json({
      status: "error",
      message: `Not found ${this.req.originalUrl}`,
    });
  }

  protected handleError(error: Error) {
    if (error instanceof NotFoundError) {
      this.handleNotFound();
      return;
    }
    if (error instanceof ValidationError) {
      this.res.status(400).json({
        status: "error",
        message: error.message,
        data: error.errors,
      });
      return;
    }
    logger.error(error);
    this.res.status(500).json({ status: "error", message: error.toString() });
  }
}
