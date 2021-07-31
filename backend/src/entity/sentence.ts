import { Entity, Column, OneToMany } from "typeorm";
import { ApplicationEntity } from "./application";
import { Form } from "./form";

@Entity()
export class Sentence extends ApplicationEntity {
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
