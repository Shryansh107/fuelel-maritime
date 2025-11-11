import { Router } from 'express';

export const poolsRouter = Router();

poolsRouter.post('/', async (_req, res) => {
  res.json({ members: [], sumAfter: 0 });
});


