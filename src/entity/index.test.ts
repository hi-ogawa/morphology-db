import "mocha";
import * as assert from "assert/strict";
import { Lemma } from "./";
import { dbHooks } from "../test-helper";

describe("entity", () => {
  dbHooks();

  describe("Lemma", () => {
    describe("findOrInsert", () => {
      it("case1", async () => {
        const lemma1 = await Lemma.findOrInsert("hi");
        assert.equal(await Lemma.count(), 1);
        const lemma2 = await Lemma.findOrInsert("hi");
        assert.equal(await Lemma.count(), 1);
        assert.equal(lemma1.id, lemma2.id);
      });
    });

    describe("relations", async () => {
      it("case1", async () => {
        await Lemma.insert({ word: "hi" });
        const lemma = await Lemma.findOne({ word: "hi" });
        assert.equal(lemma?.word, "hi");
        assert.equal(lemma?.forms, undefined);
      });

      it("case2", async () => {
        await Lemma.insert({ word: "hi" });
        const lemma = await Lemma.findOne(
          { word: "hi" },
          { relations: ["forms"] }
        );
        assert.equal(lemma?.word, "hi");
        assert.deepEqual(lemma?.forms, []);
      });

      it("case3", async () => {
        await Lemma.insert({ word: "hi" });
        const [lemma] = await Lemma.find({ word: "hi" });
        assert.equal(lemma?.word, "hi");
        assert.deepEqual(lemma?.forms, undefined);
      });
    });
  });
});
