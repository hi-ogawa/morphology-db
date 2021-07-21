import { createConnection } from "typeorm";
export * from "./entity";

export async function init() {
  await createConnection();
}
