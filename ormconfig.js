module.exports = [
  {
    name: "default",
    type: "sqlite",
    database:
      process.env.NODE_ENV === "test" ? ":memory:" : "data/morphology.sqlite3",
    entities: ["build/entity/index.js"],
  },
];
