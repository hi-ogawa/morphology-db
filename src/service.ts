interface MorphologyResult {}

interface FuzzySearchResult {}

export class Service {
  static async morphology(_word: string): Promise<MorphologyResult> {
    return todo;
  }

  static async fuzzySearch(_word: string): Promise<FuzzySearchResult> {
    return todo;
  }
}
