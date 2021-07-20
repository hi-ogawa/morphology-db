import * as fs from "fs";

export interface WordLine {
  // id: string;
  form: string;
  lemma: string;
  upos: string;
  // xpos: string;
  feats: string;
  // head: string;
  // deprel: string;
  // deps: string;
  // misc: string;
}

export interface Annotation {
  metadata: Record<string, string>;
  words: WordLine[];
}

// @ts-expect-error (currently unused)
function parseRecord(s: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const t of s.split("|")) {
    const i = t.indexOf("=");
    result[t.substring(0, i)] = t.substring(i + 1);
  }
  return result;
}

export function parseAnnotation(raw: string): Annotation {
  const lines = raw.trim().split("\n");
  const result: Annotation = {
    metadata: {},
    words: [],
  };
  for (const line of lines) {
    if (line[0] === "#") {
      const i = line.indexOf("=");
      if (i !== -1) {
        result.metadata[line.substring(1, i).trim()] = line
          .substring(i + 1)
          .trim();
      }
      continue;
    }
    const tokens = line.split("\t");
    if (tokens.length !== 10) {
      throw new Error(`Unexpected line: ${line}`);
    }
    const [_id, form, lemma, upos, _xpos, feats, _head, _deprel, _deps, _misc] =
      tokens;
    result.words.push({
      form,
      lemma,
      upos,
      feats,
    });
  }
  return result;
}

export async function parseFile(infile: string): Promise<Annotation[]> {
  const content = await fs.promises.readFile(infile, { encoding: "utf-8" });
  return content.trim().split("\n\n").map(parseAnnotation);
}
