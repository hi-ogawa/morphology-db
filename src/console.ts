export * from "./entity";
import { Db } from "./db";

export async function init() {
  await Db.initialize();
}
