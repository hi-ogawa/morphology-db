import { Entity, Column, Connection } from "typeorm";
import { uniqBy, chunk } from "lodash";
import { ApplicationEntity } from "./application";
import { Form } from "./form";
import { Lemma } from "./lemma";
import { Db } from "../db";
import { progressBar } from "../utils";

//
// Collect unique words from Lemma and Form for fuzzy-search
//

@Entity()
export class Vocabulary extends ApplicationEntity {
  @Column({ primary: true, generated: true })
  id!: number;

  @Column({ unique: true })
  word!: string;
}

export async function importVocabulary(
  _conn: Connection,
  progress: boolean = false
) {
  // cf. https://sqlite.com/c3ref/limit.html
  const CHUNK_SIZE = 10000;

  progress && console.error(":: Selecting Lemma...");
  const lemmas = await Lemma.xqb().select("Lemma.word", "word").getRawMany();

  progress && console.error(":: Selecting Form...");
  const forms = await Form.xqb().select("Form.word", "word").getRawMany();

  progress && console.error(":: Filtering unique words...");
  const words = uniqBy(forms.concat(lemmas), (o) => o.word);
  const chunks = chunk(words, CHUNK_SIZE);

  progress && console.error(":: Inserting Vocabulary...");
  await Vocabulary.xqb().delete().execute();
  for (const chunkWords of progress ? progressBar(chunks) : chunks) {
    await Vocabulary.xqb().insert().values(chunkWords).execute();
  }
}

async function main() {
  await Db.withConnection((conn) => importVocabulary(conn, true));
}

if (require.main === module) {
  main();
}
