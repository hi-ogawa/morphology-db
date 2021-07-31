import {
  BaseEntity,
  SelectQueryBuilder,
  FindManyOptions,
  FindOptionsUtils,
} from "typeorm";
import { ObjectType } from "typeorm/common/ObjectType";

//
// Extends BaseEntity to save some typing e.g.
//
//   Form.createQueryBuilder().where({ word: "hello" }).leftJoinAndSelect("Form.lemma", "lemma").limit(10).getMany()
//     ⇓
//   Form.xfind({ word: "hello" }, { relations: ["lemma"], take: 10 })
//

export class ApplicationEntity extends BaseEntity {
  static xqb<T extends ApplicationEntity>(
    this: ObjectType<T>
  ): SelectQueryBuilder<T> {
    return (this as any).createQueryBuilder();
  }

  static xfindqb<T extends ApplicationEntity>(
    this: ObjectType<T>,
    opts1: Partial<T>,
    opts2?: FindManyOptions<T>
  ): SelectQueryBuilder<T> {
    let qb = (this as any).xqb();
    if (opts2) {
      FindOptionsUtils.applyOptionsToQueryBuilder<T>(qb, opts2);
    }
    qb.where(opts1);
    return qb;
  }

  static xfind<T extends ApplicationEntity>(
    this: ObjectType<T>,
    opts1: Partial<T>,
    opts2?: FindManyOptions<T>
  ): Promise<T[]> {
    return (this as any).xfindqb(opts1, opts2).getMany();
  }
}
