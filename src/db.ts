import { Connection, createConnection } from "typeorm";

export class Db {
  connection?: Connection;

  async connect() {
    this.connection = await createConnection();
  }

  async close() {
    await this.connection?.close();
  }

  async reset() {
    await this.connection?.dropDatabase();
    await this.connection?.synchronize();
  }

  static async withConnection(
    handler: (conn: Connection) => Promise<void>
  ): Promise<void> {
    const db = new Db();
    await db.connect();
    await handler(db.connection!);
    await db.close();
  }
}
