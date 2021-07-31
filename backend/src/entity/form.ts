import { Entity, Column, ManyToOne } from "typeorm";
import { ApplicationEntity } from "./application";
import { Lemma } from "./lemma";
import { Sentence } from "./sentence";

@Entity()
export class Form extends ApplicationEntity {
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

  static async search(word: string): Promise<Form[]> {
    const collection = await this.find({ word });
    return collection;
  }
}
