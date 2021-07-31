import * as fs from "fs";
import * as assert from "assert/strict";
import { Connection, getConnection } from "typeorm";
import { SqliteDriver } from "typeorm/driver/sqlite/SqliteDriver";

//
// https://www.sqlite.org/spellfix1.html
//
// Build extension shared library via
//   wget -P data https://github.com/sqlite/sqlite/raw/version-3.36.0/ext/misc/spellfix.c
//   gcc -fPIC -shared -O3 data/spellfix.c -o data/spellfix.so
//

const SPELLFIX_SO = "./data/spellfix.so";

// Edit distance cost table
// prettier-ignore
const COST_CONFIG = [
  // Default insert/delete/substituion
  ['', '?', 110],
  ['?', '', 120],
  ['?', '?', 100],
  // Special substitution
  ['е', 'ё', 20], ['ё', 'е', 20],
  ['и', 'й', 20], ['й', 'и', 20],
  ['ь', 'ы', 20], ['ы', 'ь', 20],
  ['ш', 'щ', 20], ['щ', 'ш', 20],
  ['е', 'э', 40], ['э', 'е', 40],
  ['ч', 'ц', 40], ['ц', 'ч', 40],
  ['б', 'в', 40], ['в', 'б', 40],
  ['у', 'ю', 40], ['ю', 'у', 40],
  ['а', 'о', 80], ['о', 'а', 80],
  ['а', 'я', 80], ['я', 'а', 80],
]

export async function loadExtension(conn: Connection = getConnection()) {
  assert.ok(fs.existsSync(SPELLFIX_SO));
  assert.ok(conn.driver instanceof SqliteDriver);
  const { databaseConnection } = conn.driver;
  const error = await new Promise((resolve) => {
    databaseConnection.loadExtension(SPELLFIX_SO, resolve);
  });
  assert.ok(!error);
}

export async function createEditcost(conn: Connection = getConnection()) {
  const queryRunner = conn.createQueryRunner();
  if (await queryRunner.hasTable("editcost")) {
    await await queryRunner.query(`DROP TABLE editcost`);
  }
  await queryRunner.query(
    `CREATE TABLE editcost(iLang INT, cFrom TEXT, cTo TEXT, iCost INT)`
  );
  for (const [from, to, cost] of COST_CONFIG) {
    await queryRunner.query(
      `INSERT INTO editcost(iLang, cFrom, cTo, iCost) VALUES(0, '${from}', '${to}', ${cost})`
    );
  }
}

export async function enableEditcost(conn: Connection = getConnection()) {
  const queryRunner = conn.createQueryRunner();
  await queryRunner.query(`select editdist3('editcost')`);
}

export async function initializeExtension(conn: Connection = getConnection()) {
  await loadExtension(conn);
  await createEditcost(conn);
  await enableEditcost(conn);
}
