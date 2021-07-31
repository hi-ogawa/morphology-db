import "mocha";
import * as assert from "assert/strict";
import { Lemma } from "./";
import { Vocabulary, importVocabulary } from "./vocabulary";
import { dbHooks, dbFixtures } from "../test-helper";

describe("entity", () => {
  const db = dbHooks();

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

  describe("Vocabulary", () => {
    describe("importVocabulary", () => {
      it("case1", async () => {
        await importVocabulary(db.connection!);
        const result = await Vocabulary.find();
        assert.deepEqual(result, []);
      });

      it("case2", async () => {
        await dbFixtures();
        await importVocabulary(db.connection!);
        const result = await Vocabulary.find();
        const words = result.map((o) => o.word);
        assert.ok(words.includes("район"));
        assert.ok(words.includes("районе"));
      });
    });
  });
});
