import { Router } from 'express';

export const complianceRouter = Router();

complianceRouter.get('/cb', async (_req, res) => {
  res.json({ cb_before: 0, applied: 0, cb_after: 0 });
});

complianceRouter.get('/adjusted-cb', async (_req, res) => {
  res.json({ shipId: null, year: null, cb_after: 0 });
});


