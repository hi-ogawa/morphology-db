import { Connection, createConnection } from "typeorm";

export class Db {
  connection?: Connection;

  connect = async () => {
    this.connection = await createConnection();
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
