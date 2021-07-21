import "mocha";
import * as assert from "assert";
import { Db } from "./db";
import { Lemma, Form, Sentence } from "./entity";
import { saveAnnotation } from "./conllu-import";
import { example1 } from "./fixtures";

describe("conllu-import", () => {
  Db.mochaHooks();

  describe("saveAnnotation", () => {
    it("case1", async () => {
      const [_raw, annotation] = example1;
      await saveAnnotation(annotation);
      assert.strictEqual(await Sentence.count(), 1);
      assert.strictEqual(await Lemma.count(), 9);
      assert.strictEqual(await Form.count(), 9);
    });
  });
});
