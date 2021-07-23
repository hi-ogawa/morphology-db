import { before, after, beforeEach } from "mocha";
import { example1 } from "./fixtures";
import { saveAnnotation } from "./conllu-import";
import { Db } from "./db";

export function dbHooks(): Db {
  const db = new Db();
  before(db.connect);
  after(db.close);
  beforeEach(db.reset);
  return db;
}

export async function dbFixtures() {
  await saveAnnotation(example1[1]);
}
