import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { routesRouter } from '../../adapters/inbound/http/routes.js';
import { complianceRouter } from '../../adapters/inbound/http/compliance.js';
import { bankingRouter } from '../../adapters/inbound/http/banking.js';
import { poolsRouter } from '../../adapters/inbound/http/pools.js';

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

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});


