import { Connection, createConnection } from "typeorm";
import { before, after, beforeEach } from "mocha";

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

  static mochaHooks() {
    let db = new Db();
    before(db.connect);
    after(db.close);
    beforeEach(db.reset);
  }
}
