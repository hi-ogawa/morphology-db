import "mocha";
import * as assert from "assert";
import { Service } from "./service";
import { Db } from "./db";

describe("Service", () => {
  Db.mochaHooks();

  describe("search", () => {
    it("case1", async () => {
      const word = "районе";
      const result = await Service.search(word);
      assert.deepStrictEqual(result, undefined);
    });

    it("case2", async () => {
      await Db.fixtures();
      const word = "районе";
      const result = await Service.search(word);
      assert.strictEqual(result?.word, "район");
      assert.strictEqual(result?.forms[0].word, "районе");
    });
  });

  describe("fuzzySearch", () => {});
});
