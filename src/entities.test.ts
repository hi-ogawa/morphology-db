import "mocha";
import * as assert from "assert";
import { Db } from "./db";
import { Lemma, Form, Sentence, saveAnnotation } from "./entities";
import { example1 } from "./fixtures";

describe("entities", () => {
  const db = new Db();

  before(async () => {
    await db.connect();
  });

  after(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await db.reset();
  });

  describe("saveAnnotation", () => {
    it("example1", async () => {
      const [_raw, annotation] = example1;
      await saveAnnotation(annotation);
      assert.strictEqual(await Sentence.count(), 1);
      assert.strictEqual(await Lemma.count(), 9);
      assert.strictEqual(await Form.count(), 9);
    });
  });
});
