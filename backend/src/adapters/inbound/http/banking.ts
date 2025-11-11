import { Router } from 'express';

export const bankingRouter = Router();

bankingRouter.get('/records', async (_req, res) => {
  res.json([]);
});

bankingRouter.post('/bank', async (_req, res) => {
  res.json({ ok: true });
});

bankingRouter.post('/apply', async (_req, res) => {
  res.json({ ok: true });
});


