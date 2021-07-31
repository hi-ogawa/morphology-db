import { Lemma, Form, Vocabulary } from "./entity";

type FuzzySearchResult = {
  word: string;
  editdist: number;
}[];

export class Service {
  static async search(word: string): Promise<Lemma[]> {
    // NOTE: there can be multiple lemmas matching given word. (e.g. "легко" matches "легко" and "легкий"),
    //       probably due to annotation error.
    const rows = await Form.xfindqb({ word })
      .select("DISTINCT Form.lemmaId", "id")
      .getRawMany();
    const ids = rows.map((row) => row.id);
    const result = await Lemma.xfindqb(
      {},
      { relations: ["forms", "forms.sentence"] }
    )
      .whereInIds(ids)
      .orWhere("Lemma.word = :word", { word })
      .groupBy("Lemma__forms.word") // Limit to single form for each unique word
      .orderBy("editdist3(:search_word, Lemma__forms.word)")
      .setParameter("search_word", word)
      .getMany();
    return result;
  }

  static async fuzzySearch(
    word: string,
    limit: number = 50
  ): Promise<FuzzySearchResult> {
    const result = await Vocabulary.xqb()
      .select("Vocabulary.word", "word")
      .addSelect("editdist3(:search_word, word)", "editdist")
      .setParameter("search_word", word)
      .orderBy("editdist")
      .limit(limit)
      .getRawMany();
    return result;
  }
}
