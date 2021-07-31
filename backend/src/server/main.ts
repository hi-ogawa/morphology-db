import { app } from "./app";
import { Db } from "../db";
import { config } from "../config";
import { logger } from "../logger";

export async function main() {
  await Db.initialize();
  app.listen(config.PORT, () => {
    logger.info(`Listening on port ${config.PORT}`);
  });
}

if (require.main === module) {
  main();
}
