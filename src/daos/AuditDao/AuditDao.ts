import Audit from '../../entities/audit';
import { EntityManager } from 'typeorm';
import { getAuditRoute } from '../../utils/common';

export default class AuditDao {
  static async insert(entityManager: EntityManager, user: string, url: string, body?: any) {
    try {
      const date = new Date();
      const audit = {
        userid: user,
        date,
        event: getAuditRoute(url),
        path: url,
        body,
      } as Audit;
      return await entityManager.getRepository(Audit).insert(audit);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
