import * as entities from "./entity";
import { config } from "./config";

export const ormconfig = {
  name: "default",
  entities: Object.values(entities),
  logging: config.DB_LOGGING,
  type: "sqlite",
  database: config.ENV === "test" ? ":memory:" : "data/morphology.sqlite3",
};
