import { Entity, BaseEntity, Column, OneToMany } from "typeorm";
import { Form } from "./form";

@Entity()
export class Sentence extends BaseEntity {
  @Column({ primary: true, generated: true })
  id!: number;

  @Column()
  source!: string;

  @Column()
  sentId!: string;

  @Column()
  text!: string;

  @OneToMany(() => Form, (form) => form.sentence)
  forms!: Form[];
}
