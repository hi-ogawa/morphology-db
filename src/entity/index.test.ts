import "mocha";
import * as assert from "assert";
import { Lemma } from "./";
import { Db } from "../db";

describe("entity", () => {
  Db.mochaHooks();

  describe("Lemma", () => {
    describe("findOrInsert", () => {
      it("case1", async () => {
        const lemma1 = await Lemma.findOrInsert("hi");
        assert.strictEqual(await Lemma.count(), 1);
        const lemma2 = await Lemma.findOrInsert("hi");
        assert.strictEqual(await Lemma.count(), 1);
        assert.strictEqual(lemma1.id, lemma2.id);
      });
    });

    describe("relations", async () => {
      it("case1", async () => {
        await Lemma.insert({ word: "hi" });
        const lemma = await Lemma.findOne({ word: "hi" });
        assert.strictEqual(lemma?.word, "hi");
        assert.strictEqual(lemma?.forms, undefined);
      });

      it("case2", async () => {
        await Lemma.insert({ word: "hi" });
        const lemma = await Lemma.findOne(
          { word: "hi" },
          { relations: ["forms"] }
        );
        assert.strictEqual(lemma?.word, "hi");
        assert.deepStrictEqual(lemma?.forms, []);
      });

      it("case3", async () => {
        await Lemma.insert({ word: "hi" });
        const [lemma] = await Lemma.find({ word: "hi" });
        assert.strictEqual(lemma?.word, "hi");
        assert.deepStrictEqual(lemma?.forms, undefined);
      });
    });
  });
});
