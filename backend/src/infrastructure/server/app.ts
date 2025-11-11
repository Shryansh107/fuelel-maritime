import express from 'express';
import cors from 'cors';
import { routesRouter } from '../../adapters/inbound/http/routes.js';
import { complianceRouter } from '../../adapters/inbound/http/compliance.js';
import { bankingRouter } from '../../adapters/inbound/http/banking.js';
import { poolsRouter } from '../../adapters/inbound/http/pools.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/routes', routesRouter);
  app.use('/compliance', complianceRouter);
  app.use('/banking', bankingRouter);
  app.use('/pools', poolsRouter);

  return app;
}


