# Morphology database

```bash
# Download data
for NAME in Taiga SynTagRus GSD PUD; do
  for TYPE in train dev test; do
    wget -nc -P data https://github.com/UniversalDependencies/UD_Russian-$NAME/raw/r2.8/ru_${NAME@L}-ud-${TYPE}.conllu
  done
done

# Import data to sqlite
npm install
npm run build
npm run db:reset
npm run db:import -- data/*.conllu

# Explore data
npm run console
> await g.init()
> await g.Lemma.count()
61347
> await g.Sentence.count()
85789
> await g.Form.count()
1422092
> form = await g.Form.findOne({ word: 'устал' }, { relations: ['lemma', 'sentence'] })
Form {
  id: 240555,
  word: 'устал',
  index: 9,
  upos: 'VERB',
  features: 'Aspect=Perf|Gender=Masc|Mood=Ind|Number=Sing|Tense=Past|VerbForm=Fin|Voice=Act',
  lemma: Lemma { id: 22116, word: 'устать' },
  sentence: Sentence {
    id: 12860,
    source: 'data/ru_syntagrus-ud-test.conllu',
    sentId: '2003Artist_mimansa.xml_86',
    text: 'Он почувствовал, как, наконец, от нее устал.'
  }
}
> lemma = await g.Lemma.findOne({ id: form.lemma.id }, { relations: ['forms'] })
Lemma {
  id: 22116,
  word: 'устать',
  forms: [
    Form {
      id: 136481,
      word: 'устать',
      index: 8,
      upos: 'VERB',
      features: 'Aspect=Perf|VerbForm=Inf|Voice=Act'
    },
    Form {
      id: 193110,
      word: 'устали',
      index: 3,
      upos: 'VERB',
      features: 'Aspect=Perf|Mood=Ind|Number=Plur|Tense=Past|VerbForm=Fin|Voice=Act'
    },
    Form {
      id: 240555,
      word: 'устал',
      index: 9,
      upos: 'VERB',
      features: 'Aspect=Perf|Gender=Masc|Mood=Ind|Number=Sing|Tense=Past|VerbForm=Fin|Voice=Act'
    },
    ...
```

# References

- [Universal dependencies](https://universaldependencies.org)

  - [.conllu format](https://universaldependencies.org/format.html)
  - [Russian dataset](https://universaldependencies.org/ru/index.html)

- [Grew-match](http://match.grew.fr)

  - [Form query example](http://match.grew.fr/?corpus=UD_Russian-SynTagRus@2.8&custom=60f6a3f2bd728)
