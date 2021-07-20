import { createConnection } from "typeorm";
export * from "./entities";

export async function init() {
  await createConnection();
}
