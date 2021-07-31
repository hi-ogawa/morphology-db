import { Router } from "express";
import { makeRouterDSL } from "ts-actionpack";
import {
  FormsController,
  LemmasController,
  SentencesController,
  HomeController,
} from "./controllers";

export const router = Router();
const { GET, ALL } = makeRouterDSL(router);

// prettier-ignore
{
  GET("/forms/search",    FormsController,      "search");
  GET("/forms/:id",       FormsController,      "show");

  GET("/lemmas/search",   LemmasController,     "search");
  GET("/lemmas/:id",      LemmasController,     "show");

  GET("/sentences/:id",   SentencesController,  "show");

  GET("/search",          HomeController,       "search");
  GET("/fuzzy-search",    HomeController,       "fuzzySearch");

  ALL("*",                HomeController,       "notFound");
}
