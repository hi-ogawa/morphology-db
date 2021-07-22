import "mocha";
import assert from "assert";
import { Service } from "./service";
import { dbHooks, dbFixtures } from "./test-helper";

describe("Service", () => {
  dbHooks();

  describe("search", () => {
    it("case1", async () => {
      const word = "районе";
      const result = await Service.search(word);
      assert.deepStrictEqual(result, undefined);
    });

    it("case2", async () => {
      await dbFixtures();
      const word = "районе";
      const result = await Service.search(word);
      assert.strictEqual(result?.word, "район");
      assert.strictEqual(result?.forms[0].word, "районе");
    });
  });

  describe("fuzzySearch", () => {});
});
