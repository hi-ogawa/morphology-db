import { EntityManager, getManager } from "typeorm";
import { Form, Lemma, Sentence } from "./entity";
import { Annotation, parseFile } from "./conllu";
import { progressBar } from "./utils";
import { Db } from "./db";

export async function saveAnnotation(
  annotation: Annotation,
  source: string = "__default__",
  manager: EntityManager = getManager()
) {
  const sentence = new Sentence();
  sentence.source = source;
  sentence.sentId = annotation.metadata["sent_id"];
  sentence.text = annotation.metadata["text"];
  await manager.save(sentence);
  for (const [index, line] of annotation.words.entries()) {
    const form = new Form();
    form.index = index;
    form.word = line.form;
    form.upos = line.upos;
    form.features = line.feats;
    form.lemma = await Lemma.findOrInsert(line.lemma, manager);
    form.sentence = sentence;
    await manager.save(form);
  }
}

export async function importFile(
  infile: string,
  manager: EntityManager = getManager()
) {
  const annotations = await parseFile(infile);
  for (const annotation of progressBar(annotations)) {
    await saveAnnotation(annotation, infile, manager);
  }
}

async function main() {
  await Db.withConnection(async (connection) => {
    const files = process.argv.slice(2);
    for (const file of files) {
      // NOTE: Too slow without transaction
      await connection.transaction(async (manager) => {
        console.error(`:: Importing ${file} ...`);
        await importFile(file, manager);
      });
    }
  });
}

if (require.main === module) {
  main();
}
