import "mocha";
import * as assert from "assert";
import * as supertest from "supertest";
import { app } from "./app";
import { Db } from "../db";
import { Form } from "../entity";

describe("app", () => {
  Db.mochaHooks();

  describe("/forms/search", () => {
    it("case1", async () => {
      const res = await supertest(app).get("/forms/search");
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(
        res.body.message,
        "data should have required property 'word'"
      );
    });

    it("case2", async () => {
      const res = await supertest(app)
        .get("/forms/search")
        .query({ word: "хорошо" });
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, []);
    });

    it("case3", async () => {
      await Db.fixtures();
      const word = "районе";
      const res = await supertest(app).get("/forms/search").query({ word });
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, [
        {
          features: "Animacy=Inan|Case=Loc|Gender=Masc|Number=Sing",
          id: 6,
          index: 5,
          upos: "NOUN",
          word: "районе",
        },
      ]);
    });
  });

  describe("/forms/:id", () => {
    it("case1", async () => {
      const res = await supertest(app).get("/forms/12345678");
      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.body.message, "Not found /forms/12345678");
    });

    it("case2", async () => {
      await Db.fixtures();
      const form = await Form.findOne();
      const id = form!.id;
      const res = await supertest(app).get(`/forms/${id}`);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.data.id, id);
    });
  });

  describe("/lemmas/search", () => {
    it("case1", async () => {
      await Db.fixtures();
      const word = "район";
      const res = await supertest(app).get(`/lemmas/search`).query({ word });
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, [
        {
          id: 6,
          word: "район",
        },
      ]);
    });
  });

  describe("/lemmas/:id", () => {
    it("case1", async () => {
      await Db.fixtures();
      const id = 6;
      const res = await supertest(app).get(`/lemmas/${id}`);
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, {
        id: 6,
        word: "район",
        forms: [
          {
            features: "Animacy=Inan|Case=Loc|Gender=Masc|Number=Sing",
            id: 6,
            index: 5,
            upos: "NOUN",
            word: "районе",
          },
        ],
      });
    });
  });

  describe("/sentences/:id", () => {
    it("case1", async () => {
      await Db.fixtures();
      const id = 1;
      const res = await supertest(app).get(`/sentences/${id}`);
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(
        res.body.data.text,
        "Безгачиха -- деревня в Бабушкинском районе Вологодской области."
      );
      assert.deepStrictEqual(res.body.data.forms[5], {
        features: "Animacy=Inan|Case=Loc|Gender=Masc|Number=Sing",
        id: 6,
        index: 5,
        upos: "NOUN",
        word: "районе",
      });
    });
  });

  describe("/search", () => {
    it("case1", async () => {
      await Db.fixtures();
      const word = "районе";
      const res = await supertest(app).get(`/search`).query({ word });
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.data, {
        id: 6,
        word: "район",
        forms: [
          {
            features: "Animacy=Inan|Case=Loc|Gender=Masc|Number=Sing",
            id: 6,
            index: 5,
            upos: "NOUN",
            word: "районе",
          },
        ],
      });
    });

    it("case2", async () => {
      const word = "районе";
      const res = await supertest(app).get(`/search`).query({ word });
      assert.strictEqual(res.statusCode, 404);
    });
  });

  describe.skip("/fuzzy-search", () => {
    it("case1", async () => {
      const word = "раион";
      const res = await supertest(app).get(`/fuzzy-search`).query({ word });
      assert.strictEqual(res.statusCode, 200);
    });
  });
});
