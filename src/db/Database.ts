import { Connection, createConnection, getConnectionOptions, ConnectionOptions } from 'typeorm';
import { localConnection } from './index';

class Database {
  private connection: Promise<Connection>;
  public async getConnection(): Promise<Connection> {
    try {
      const defaultConnectionOptions = await getConnectionOptions();
      if (process?.env?.NODE_ENV === 'dev') {
        const connectionOptions = Object.assign(defaultConnectionOptions, localConnection);
        return await this.getExistingOrNewConnection(connectionOptions);
      } else {
        const connectionOptions = Object.assign(defaultConnectionOptions, localConnection);
        return await this.getExistingOrNewConnection(connectionOptions);
      }
    } catch (err: any) {
      if (err.errors) {
        err.message = err.errors[0];
      }
      throw err;
    }
  }
  public async getExistingOrNewConnection(connectionOptions: ConnectionOptions): Promise<Connection> {
    if (this.connection) {
      const connection = await this.connection;
      if (connection.isConnected) {
        return connection;
      } else {
        await this.closeConnection();
      }
    }
    return this.createConnection(connectionOptions);
  }
  private async createConnection(connectionOptions: ConnectionOptions): Promise<Connection> {
    try {
      this.connection = createConnection(connectionOptions);
    } catch (e) {
      this.connection = null;
      throw e;
    }
    return this.connection;
  }
  private async closeConnection(): Promise<void> {
    if (this.connection) {
      await (await this.connection).close();
      this.connection = null;
    }
  }
}
const db = new Database();
export { db as Database };
export default Database;
