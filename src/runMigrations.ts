import { getManager } from 'typeorm';
import { Database } from './db/Database';

Database.getConnection().then(async (connection) => {
  await getManager().connection.runMigrations({ transaction: 'each' });
});
