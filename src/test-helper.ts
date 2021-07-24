import { before, after, beforeEach } from "mocha";
import { getConnection, Connection } from "typeorm";
import { example1 } from "./fixtures";
import { saveAnnotation } from "./conllu-import";
import { importVocabulary } from "./entity/vocabulary";
import { Db } from "./db";

export function dbHooks(): Db {
  const db = new Db();
  before(db.connect);
  after(db.close);
  beforeEach(db.reset);
  return db;
}

export async function dbFixtures(conn: Connection = getConnection()) {
  await saveAnnotation(example1[1], "__default__", conn.manager);
  await importVocabulary(conn, false);
}
