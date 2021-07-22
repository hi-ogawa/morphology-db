import { Lemma, Form } from "./entity";
import { assertDefined } from "./utils";

interface FuzzySearchResult {
  lemmas: Lemma[];
  forms: Form[];
}

export class Service {
  static async search(word: string): Promise<Lemma | undefined> {
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

  static async fuzzySearch(_word: string): Promise<FuzzySearchResult> {
    // lemmas
    // forms
    return todo;
  }
}
