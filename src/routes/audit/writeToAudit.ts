import { writeToErr } from '../../utils/common';
import { getManager } from 'typeorm';
import AuditDao from '../../daos/AuditDao/AuditDao';
import { getFormattedBody } from './getBody';

export const writeToAudit = async (req: any, resp: any, next: any) => {
  try {
    const body = getFormattedBody(req.body);
    await AuditDao.insert(getManager(), req.user, req.originalUrl, body);
    next();
  } catch (e) {
    await writeToErr(req.originalUrl, req.user, e, 500, 'writeToAudit');
    resp.status(500).send('Server Error');
  }
};
