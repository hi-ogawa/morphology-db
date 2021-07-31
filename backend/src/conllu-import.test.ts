import "mocha";
import * as assert from "assert/strict";
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
      assert.equal(await Sentence.count(), 1);
      assert.equal(await Lemma.count(), 9);
      assert.equal(await Form.count(), 9);
    });
  });
});
