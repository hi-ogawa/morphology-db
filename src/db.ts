import { Connection, createConnection, ConnectionOptionsReader } from "typeorm";
import * as entities from "./entity";

export class Db {
  connection?: Connection;

  connect = async () => {
    const options = await new ConnectionOptionsReader().get("default");
    this.connection = await createConnection({
      ...options,
      entities: Object.values(entities),
    });
  };

  close = async () => {
    await this.connection?.close();
    this.connection = undefined;
  };

  reset = async () => {
    await this.connection?.dropDatabase();
    await this.connection?.synchronize();
  };

  static async withConnection(
    handler: (conn: Connection) => Promise<void>
  ): Promise<void> {
    const db = new Db();
    await db.connect();
    await handler(db.connection!);
    await db.close();
  }

  static async initialize() {
    const db = new Db();
    await db.connect();
  }
}
