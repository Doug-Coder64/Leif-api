import { DBConnection } from '../index';

const header = 'postgres://';

export const getDBCredentials = (url: string): DBConnection => {
  const firstColonIndex = url.indexOf(':', header.length);
  const atIndex = url.indexOf('@');
  const secondColonIndex = url.indexOf(':', atIndex);
  const slashIndex = url.indexOf('/', secondColonIndex);
  const username: string = url.substring(header.length, firstColonIndex);
  const password: string = url.substring(firstColonIndex + 1, atIndex);
  const host: string = url.substring(atIndex + 1, secondColonIndex);
  const port: string = url.substring(secondColonIndex + 1, slashIndex);
  const database: string = url.substring(slashIndex + 1);
  return {
    port: parseInt(port),
    username,
    password,
    host,
    database,
    ssl: {
      rejectUnauthorized: false,
    },
  };
};
