const entities = require("./build/entity");

module.exports = [
  {
    name: "default",
    entities: Object.values(entities),
    logging: !!process.env.DB_LOGGING,
    type: "sqlite",
    database:
      process.env.NODE_ENV === "test" ? ":memory:" : "data/morphology.sqlite3",
    entities: ["build/entity/index.js"],
  },
];
