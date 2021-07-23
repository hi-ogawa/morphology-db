import { Connection, createConnection } from "typeorm";
import { initializeExtension } from "./sqlite-spellfix";

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
    await initializeExtension(this.connection);
  };

  async query(q: string) {
    return this.connection?.createQueryRunner().query(q);
  }

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
    await initializeExtension(db.connection);
  }
}
