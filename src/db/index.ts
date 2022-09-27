export interface DBConnection {
  username: string;
  host: string;
  database: string;
  password: string;
  port: number;
  ssl?: any;
}

export const localConnection: DBConnection = {
  username: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
};
