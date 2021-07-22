import "mocha";
import assert from "assert";
import { Lemma, Form, Sentence } from "./entity";
import { saveAnnotation } from "./conllu-import";
import { example1 } from "./fixtures";
import { dbHooks } from "./test-helper";

describe("conllu-import", () => {
  dbHooks();

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
