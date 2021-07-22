export { routes } from "./routes-utils";
import { draw } from "./routes-utils";
import {
  FormsController,
  LemmasController,
  SentencesController,
  HomeController,
} from "./controllers";

// prettier-ignore
{
draw("get", "/forms/search",    FormsController,      "search");
draw("get", "/forms/:id",       FormsController,      "show");

draw("get", "/lemmas/search",   LemmasController,     "search");
draw("get", "/lemmas/:id",      LemmasController,     "show");

draw("get", "/sentences/:id",   SentencesController,  "show");

draw("get", "/search",          HomeController,       "search");
draw("get", "/fuzzy-search",    HomeController,       "fuzzySearch");
}
