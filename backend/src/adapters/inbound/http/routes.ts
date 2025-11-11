import { Router } from 'express';

export const routesRouter = Router();

routesRouter.get('/', async (_req, res) => {
  res.json([]);
});

routesRouter.post('/:id/baseline', async (_req, res) => {
  res.json({ ok: true });
});

routesRouter.get('/comparison', async (_req, res) => {
  res.json({ baseline: null, comparisons: [] });
});


