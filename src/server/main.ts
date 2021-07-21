import { app } from "./app";
import { Db } from "../db";
import { config } from "../config";

export async function main() {
  await Db.initialize();
  app.listen(config.PORT, () => {
    console.error(`[server/main.ts] Listening on port ${config.PORT}`);
  });
}

if (require.main === module) {
  main();
}
