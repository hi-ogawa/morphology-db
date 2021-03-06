import { Entity, Column, OneToMany, EntityManager, getManager } from "typeorm";
import { ApplicationEntity } from "./application";
import { Form } from "./form";

@Entity()
export class Lemma extends ApplicationEntity {
  @Column({ primary: true, generated: true })
  id!: number;

  @Column({ unique: true })
  word!: string;

  @OneToMany(() => Form, (form) => form.lemma)
  forms!: Form[];

  static async findOrInsert(
    word: string,
    manager: EntityManager = getManager()
  ): Promise<Lemma> {
    let result = await manager.findOne(this, { word });
    if (!result) {
      result = manager.create(this, { word });
      await result.save();
    }
    return result;
  }
}
