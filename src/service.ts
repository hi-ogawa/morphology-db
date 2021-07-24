import { Lemma, Form, Vocabulary } from "./entity";

type FuzzySearchResult = {
  word: string;
  editdist: number;
}[];

export class Service {
  static async search(word: string): Promise<Lemma[]> {
    const rows = await Form.xfindqb({ word })
      .select("DISTINCT Form.lemmaId", "id")
      .getRawMany();
    const result = await Lemma.xfindqb(
      {},
      { relations: ["forms", "forms.sentence"] }
    )
      .whereInIds(rows.map((row) => row.id))
      .orWhere(`Lemma.word = :word`, { word })
      .getMany();
    return result;
  }

  static async fuzzySearch(
    word: string,
    limit: number = 50
  ): Promise<FuzzySearchResult> {
    const result = await Vocabulary.xqb()
      .select("Vocabulary.word", "word")
      .addSelect(`editdist3('${word}', word)`, "editdist")
      .orderBy("editdist")
      .limit(limit)
      .getRawMany();
    return result;
  }
}
