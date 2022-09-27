import { DBConnection } from '../index';
import { getDBCredentials } from './db';

describe('getDBCredentials', () => {
  const dburl = 'postgres://MyUserName:MyPassword@MyHost:5432/DatabaseName';
  it('gets credentials', () => {
    const connection: DBConnection = getDBCredentials(dburl);
    expect(connection.username).toEqual('MyUserName');
    expect(connection.password).toEqual('MyPassword');
    expect(connection.host).toEqual('MyHost');
    expect(connection.port).toEqual(5432);
    expect(connection.database).toEqual('DatabaseName');
  });
});
