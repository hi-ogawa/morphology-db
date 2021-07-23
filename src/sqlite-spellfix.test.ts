import "mocha";
import * as assert from "assert/strict";
import { dbFixtures } from "./test-helper";
import { Db } from "./db";
import {
  loadExtension,
  createEditcost,
  enableEditcost,
} from "./sqlite-spellfix";
import { Lemma } from "./entity";

describe("sqlite-spellfix", () => {
  const db = new Db();
  before(db.connect);
  after(db.close);
  beforeEach(async () => {
    await db.connection!.dropDatabase();
    await db.connection!.synchronize();
  });

  describe("loadExtension", () => {
    it("case1", async () => {
      await loadExtension(db.connection!);
    });
  });

  describe("editdist3", () => {
    it("case1", async () => {
      await dbFixtures();
      await loadExtension(db.connection!);
      const pattern = "раионе";
      const answer = "район";
      const result = await Lemma.createQueryBuilder()
        .orderBy(`editdist3('${pattern}', lemma.word)`)
        .getMany();
      assert.equal(result[0].word, answer);
    });

    it("case2", async () => {
      await dbFixtures();
      await loadExtension(db.connection!);
      const pattern = "раионе";
      const answer = "район";
      const query = `select word, editdist3('${pattern}', word) as editdist from lemma order by editdist limit 3`;
      const result1 = await db.query(query);
      assert.deepEqual(result1[0], { word: answer, editdist: 250 });

      await createEditcost();
      await enableEditcost();
      const result2 = await db.query(query);
      assert.deepEqual(result2[0], { word: answer, editdist: 170 });
    });
  });
});
