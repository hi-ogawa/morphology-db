import { Lemma, Form } from "./entity";

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
    limit: number = 10
  ): Promise<FuzzySearchResult> {
    // TODO: Limit first character to match exactly?
    // TODO: Include Form word as well (currently too big since it includes duplicate words).
    //       We can make separate table for all unique words and search that table.
    const result = await Lemma.xqb()
      .select("Lemma.word", "word")
      .addSelect(`editdist3('${word}', Lemma.word)`, "editdist")
      .orderBy("editdist")
      .limit(limit)
      .getRawMany();
    return result;
  }
}
