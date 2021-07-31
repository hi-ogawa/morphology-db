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
npm run build                      # Build typescript
npm run sqlite-spellfix            # Build sqlite extension
npm run db:reset                   # Update db schema
npm run db:import -- data/*.conllu # Import conllu files
npm run db:vocabulary              # Create vocabulary table for fuzzy search

# Explore data
npm run console
> await g.init()
> await Promise.all([g.Lemma, g.Sentence, g.Form, g.Vocabulary].map(x => x.count()))
[ 61270, 85789, 1422092, 169985 ]
> await g.Service.fuzzySearch("тежело", 5)
[
  { word: 'тяжело', editdist: 100 },
  { word: 'тяжела', editdist: 180 },
  { word: 'нежели', editdist: 200 },
  { word: 'тяжелы', editdist: 200 },
  { word: 'весело', editdist: 200 }
]

# Testing
npm run test

# Run server
npm run server

# Deploy (see https://github.com/hi-ogawa/morphology-db/wiki/Deployment)
docker-compose build backend
bash run.sh deploy
```

# References

- [Universal dependencies](https://universaldependencies.org)

  - [.conllu format](https://universaldependencies.org/format.html)
  - [Russian dataset](https://universaldependencies.org/ru/index.html)

- [Grew-match](http://match.grew.fr)

  - [Form query example](http://match.grew.fr/?corpus=UD_Russian-SynTagRus@2.8&custom=60f6a3f2bd728)
