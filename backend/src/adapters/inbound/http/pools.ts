import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/db/prisma.js';

export const poolsRouter = Router();

const poolSchema = z.object({
  year: z.number().int(),
  members: z.array(z.object({ shipId: z.string().min(1), cb_before: z.number() })).min(1),
});

poolsRouter.post('/', async (req, res) => {
  const parse = poolSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid body', details: parse.error.flatten() });
  const { year, members } = parse.data;

  // Greedy allocation
  const surpluses = members.filter(m => m.cb_before > 0).sort((a, b) => b.cb_before - a.cb_before);
  const deficits = members.filter(m => m.cb_before < 0).sort((a, b) => a.cb_before - b.cb_before); // most negative first

  const afterMap = new Map<string, number>(members.map(m => [m.shipId, m.cb_before]));

  for (const s of surpluses) {
    let sRemain = afterMap.get(s.shipId)!;
    for (const d of deficits) {
      const dRemain = afterMap.get(d.shipId)!;
      if (sRemain <= 0) break;
      if (dRemain >= 0) continue;
      const transfer = Math.min(sRemain, Math.abs(dRemain));
      sRemain -= transfer;
      afterMap.set(s.shipId, sRemain);
      afterMap.set(d.shipId, dRemain + transfer);
    }
  }

  const afterList = members.map(m => ({ shipId: m.shipId, cb_before: m.cb_before, cb_after: afterMap.get(m.shipId)! }));
  const sumAfter = afterList.reduce((acc, m) => acc + m.cb_after, 0);
  if (sumAfter < 0) return res.status(400).json({ error: 'Sum(adjusted CB) must be ≥ 0' });

  // Rule checks
  for (const m of afterList) {
    if (m.cb_before < 0 && m.cb_after < m.cb_before) return res.status(400).json({ error: `Deficit ship ${m.shipId} would exit worse` });
    if (m.cb_before > 0 && m.cb_after < 0) return res.status(400).json({ error: `Surplus ship ${m.shipId} would exit negative` });
  }

  const pool = await prisma.pool.create({ data: { year } });
  await prisma.poolMember.createMany({
    data: afterList.map(m => ({ poolId: pool.id, shipId: m.shipId, cbBefore: m.cb_before, cbAfter: m.cb_after })),
  });

  return res.json({ poolId: pool.id, year, members: afterList, sumAfter });
});


