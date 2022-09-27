const emptyBody = '{"type":"Buffer","data":[]}';

export const getFormattedBody = (body = '') =>
  Object.keys(body).length > 0 && JSON.stringify(body) !== emptyBody ? JSON.stringify(body) : '';
