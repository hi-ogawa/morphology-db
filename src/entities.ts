import {
  Entity,
  BaseEntity,
  Column,
  OneToMany,
  ManyToOne,
  EntityManager,
  getManager,
} from "typeorm";
import { Annotation, parseFile } from "./conllu";
import { Db } from "./db";
import { progressBar } from "./utils";

@Entity()
export class Lemma extends BaseEntity {
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

export async function saveAnnotation(
  annotation: Annotation,
  source: string = "__default__",
  manager: EntityManager = getManager()
) {
  const sentence = new Sentence();
  sentence.source = source;
  sentence.sentId = annotation.metadata["sent_id"];
  sentence.text = annotation.metadata["text"];
  await manager.save(sentence);
  for (const [index, line] of annotation.words.entries()) {
    const form = new Form();
    form.index = index;
    form.word = line.form;
    form.upos = line.upos;
    form.features = line.feats;
    form.lemma = await Lemma.findOrInsert(line.lemma, manager);
    form.sentence = sentence;
    await manager.save(form);
  }
}

export async function importFile(
  infile: string,
  manager: EntityManager = getManager()
) {
  const annotations = await parseFile(infile);
  for (const annotation of progressBar(annotations)) {
    await saveAnnotation(annotation, infile, manager);
  }
}

async function main() {
  await Db.withConnection(async (connection) => {
    const files = process.argv.slice(2);
    for (const file of files) {
      // NOTE: Too slow without transaction
      await connection.transaction(async (manager) => {
        console.error(`:: Importing ${file} ...`);
        await importFile(file, manager);
      });
    }
  });
}

if (require.main === module) {
  main();
}
