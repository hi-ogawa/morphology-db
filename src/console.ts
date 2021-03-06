import { Db } from "./db";
import { initializeExtension } from "./sqlite-spellfix";
export * from "./entity";
export * from "./service";

export const db = new Db();

export async function init() {
  await db.connect();
  await initializeExtension(db.connection);
}
