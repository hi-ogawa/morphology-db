import "mocha";
import * as assert from "assert";
import { parseAnnotation, normalize } from "./conllu";
import { example1 } from "./fixtures";

describe("conllu", () => {
  describe("parseAnnotation", () => {
    it("case1", () => {
      const [raw, annotation] = example1;
      assert.deepStrictEqual(parseAnnotation(raw), annotation);
    });
  });

  describe("normalize", () => {
    it("case1", () => {
      const word1 = "вcе";
      const word2 = "все";
      assert.deepStrictEqual(word1, String.fromCodePoint(1074, 99, 1077));
      assert.deepStrictEqual(word2, String.fromCodePoint(1074, 1089, 1077));
      assert.strictEqual(normalize(word1), word2);
    });
  });
});
