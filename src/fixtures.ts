import { Annotation } from "./conllu";

type Example = [string, Annotation];

// From ru_gsd-ud-dev.conllu at https://github.com/UniversalDependencies/UD_Russian-GSD
export const example1: Example = [
  `\
# sent_id = dev-s6
# text = Безгачиха -- деревня в Бабушкинском районе Вологодской области.
1	Безгачиха	Безгачиха	PROPN	NNP	Animacy=Inan|Case=Nom|Gender=Fem|Number=Sing	3	nsubj	_	_
2	--	--	PUNCT	--	_	3	punct	_	_
3	деревня	деревня	NOUN	NN	Animacy=Inan|Case=Nom|Gender=Fem|Number=Sing	0	root	_	_
4	в	в	ADP	IN	_	6	case	_	_
5	Бабушкинском	бабушкинский	ADJ	JJL	Case=Loc|Degree=Pos|Gender=Masc|Number=Sing	6	amod	_	_
6	районе	район	NOUN	NN	Animacy=Inan|Case=Loc|Gender=Masc|Number=Sing	3	nmod	_	_
7	Вологодской	вологодский	ADJ	JJL	Case=Gen|Degree=Pos|Gender=Fem|Number=Sing	8	amod	_	_
8	области	область	NOUN	NN	Animacy=Inan|Case=Gen|Gender=Fem|Number=Sing	6	nmod	_	SpaceAfter=No
9	.	.	PUNCT	.	_	3	punct	_	_
`,
  {
    metadata: {
      sent_id: "dev-s6",
      text: "Безгачиха -- деревня в Бабушкинском районе Вологодской области.",
    },
    words: [
      {
        form: "Безгачиха",
        lemma: "Безгачиха",
        upos: "PROPN",
        feats: "Animacy=Inan|Case=Nom|Gender=Fem|Number=Sing",
      },
      { form: "--", lemma: "--", upos: "PUNCT", feats: "_" },
      {
        form: "деревня",
        lemma: "деревня",
        upos: "NOUN",
        feats: "Animacy=Inan|Case=Nom|Gender=Fem|Number=Sing",
      },
      { form: "в", lemma: "в", upos: "ADP", feats: "_" },
      {
        form: "Бабушкинском",
        lemma: "бабушкинский",
        upos: "ADJ",
        feats: "Case=Loc|Degree=Pos|Gender=Masc|Number=Sing",
      },
      {
        form: "районе",
        lemma: "район",
        upos: "NOUN",
        feats: "Animacy=Inan|Case=Loc|Gender=Masc|Number=Sing",
      },
      {
        form: "Вологодской",
        lemma: "вологодский",
        upos: "ADJ",
        feats: "Case=Gen|Degree=Pos|Gender=Fem|Number=Sing",
      },
      {
        form: "области",
        lemma: "область",
        upos: "NOUN",
        feats: "Animacy=Inan|Case=Gen|Gender=Fem|Number=Sing",
      },
      { form: ".", lemma: ".", upos: "PUNCT", feats: "_" },
    ],
  },
];
