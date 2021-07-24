import { Request, Response } from "express";
import { BaseEntity, SelectQueryBuilder } from "typeorm";
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
}
