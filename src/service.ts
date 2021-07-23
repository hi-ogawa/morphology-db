import { getConnection } from "typeorm";
import { Lemma, Form } from "./entity";
import { assertDefined } from "./utils";

type FuzzySearchResult = {
  word: string;
  editdist: number;
}[];

export class Service {
  static async search(word: string): Promise<Lemma | undefined> {
    // TODO: Return with sentence data for each form
    // TODO: Resolve incorrect lemma annotation via some heuristics (e.g. "легко" shouldn't be lemma)
    //       Just return both in that case?
    let lemma = await Lemma.findOne({ word }, { relations: ["forms"] });
    if (!lemma) {
      const form = await Form.findOne({ word }, { relations: ["lemma"] });
      if (!form) {
        return;
      }
      lemma = await Lemma.findOne(
        { id: form.lemma.id },
        { relations: ["forms"] }
      );
      assertDefined(lemma);
    }
    return lemma;
  }

  static async fuzzySearch(word: string): Promise<FuzzySearchResult> {
    // TODO: limit first character to match exactly?
    // TODO: include Form word as well (currently too big since it includes duplicate words)
    const queryRunner = getConnection().createQueryRunner();
    const tableName = "lemma";
    const limit = 10;
    const query = `select word, editdist3('${word}', word) as editdist from ${tableName} order by editdist limit ${limit}`;
    const result = await queryRunner.query(query);
    return result;
  }
}
