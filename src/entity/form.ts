import { Entity, BaseEntity, Column, ManyToOne } from "typeorm";
import { Lemma } from "./lemma";
import { Sentence } from "./sentence";

@Entity()
export class Form extends BaseEntity {
  @Column({ primary: true, generated: true })
  id!: number;

  @Column()
  word!: string;

  // Index within sentence
  @Column()
  index!: number;

  // Part-of-speech
  @Column()
  upos!: string;

  @Column()
  features!: string;

  @ManyToOne(() => Lemma, (lemma) => lemma.forms)
  lemma!: Lemma;

  @ManyToOne(() => Sentence, (sentence) => sentence.forms)
  sentence!: Sentence;
}
