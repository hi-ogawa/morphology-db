import * as fs from "fs";
import { zip } from "lodash";

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

// cf. https://github.com/UniversalDependencies/UD_Russian-Taiga/issues/4
const RE_MIXED = /([а-яА-Я][a-zA-Z])|([a-zA-Z][а-яА-Я])/;
const HOMOGLYPH_EN = "abcekmoptxyABCEHKMOPTXY";
const HOMOGLYPH_RU = "аьсекмортхуАВСЕНКМОРТХУ";
const HOMOGLYPH_EN_TO_RU = new Map(
  zip([...HOMOGLYPH_EN], [...HOMOGLYPH_RU])
) as Map<string, string>;

function translate(s: string, table: Map<string, string>): string {
  let t = "";
  for (const c of s) {
    t += table.get(c) ?? c;
  }
  return t;
}

function fixHomoglyph(word: string): string {
  if (!word.match(RE_MIXED)) {
    return word;
  }
  return translate(word, HOMOGLYPH_EN_TO_RU);
}

export function normalize(word: string): string {
  // Fix homoglyph
  word = fixHomoglyph(word);
  // Force lower case
  word = word.toLowerCase();
  return word;
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
    const isSpecial = upos === "PROPN" || feats.includes("Foreign=Yes");
    result.words.push({
      form: isSpecial ? form : normalize(form),
      lemma: isSpecial ? lemma : normalize(lemma),
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
