import express from 'express';
import cors from 'cors';
import { Database } from './db/Database';
import { authorize } from './utils/authorize';
import { writeToAudit } from './routes/audit/writeToAudit';

Database.getConnection()
  .then(async (connection) => {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.get('/', (req, res) => res.status(200).send({}));
    app.get('/api', (req, res) => res.status(200).send({}));

    app.use(cors(), authorize, express.json(), writeToAudit);

    let port = process.env.PORT;
    if (port == null || port == '') {
      port = '3010';
    }
    app.listen(port);
    console.log(`app started, listening on port ${port}`);
  })
  .catch((error) => console.log('TypeORM connection error: ', error));
