import "mocha";
import * as assert from "assert";
import { Service } from "./service";
import { dbHooks, dbFixtures } from "./test-helper";

describe("Service", () => {
  dbHooks();

  describe("search", () => {
    it("case1", async () => {
      const word = "районе";
      const result = await Service.search(word);
      assert.deepStrictEqual(result, []);
    });

    it("case2", async () => {
      await dbFixtures();
      const word = "районе";
      const result = await Service.search(word);
      assert.strictEqual(result[0].word, "район");
      assert.strictEqual(result[0].forms[0].word, "районе");
      assert.strictEqual(
        result[0].forms[0].sentence.text,
        "Безгачиха -- деревня в Бабушкинском районе Вологодской области."
      );
    });

    it("case3", async () => {
      await dbFixtures();
      const word = "район";
      const result = await Service.search(word);
      assert.strictEqual(result[0].word, "район");
    });
  });

  describe("fuzzySearch", () => {
    it("case1", async () => {
      await dbFixtures();
      const word = "раионе";
      const result = await Service.fuzzySearch(word);
      assert.deepStrictEqual(result[0].word, "район");
      assert.ok(typeof result[0].editdist, "number");
    });
  });
});
